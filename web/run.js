// Test sessions: Full test (50 tasks, no feedback) and Puzzle mode (adaptive, instant feedback, Elo-style IQ).
const app=document.getElementById('app');let S=null;
const set=h=>{app.innerHTML=h;window.scrollTo(0,0)};
const dinfo=id=>DOM.find(d=>d.id===id);
const foot=h=>`<div class="foot"><div>${h}</div></div>`;
const clear=()=>{if(S){(S.timers||[]).forEach(t=>{clearTimeout(t);clearInterval(t)});S.timers=[]}};
const later=(f,ms)=>S.timers.push(setTimeout(f,ms));
const sgn=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(1);
const A={};
/* ---- per-question clock ---- */
const TL={VCI:40,VSI:75,FRI:75,WMI:25};
const timed=()=>Store.d.set.tl!==false;
const limitFor=it=>Math.max(10,Math.round(TL[it.dom]*(.8+.1*(it.d||3))*(Store.d.set.ts||1)/5)*5);
const clk=sec=>`<div class="clk"><div class="timer"><i id="tm" style="width:100%"></i></div><span id="ts" class="mono">${sec}</span></div>`;
function startClock(sec,onEnd){
  S.clk={end:Date.now()+sec*1000,total:sec*1000,pause:0};
  S.timers.push(setInterval(()=>{
    const c=S.clk;if(!c||c.pause)return;
    const l=c.end-Date.now(),tm=document.getElementById('tm'),ts=document.getElementById('ts');
    if(tm){tm.style.width=Math.max(0,l/c.total*100)+'%';tm.parentNode.classList.toggle('low',l<10000)}
    if(ts)ts.textContent=Math.max(0,Math.ceil(l/1000));
    if(l<=0){clear();S.clk=null;S.timedOut=true;onEnd()}
  },200));
}

function newSession(mode){
  const seen=Store.d.seen||[];
  S={mode,rec:emptyRec(),used:{v:new Set(seen.filter(x=>x[0]==='v')),l:new Set(seen.filter(x=>x[0]==='l'))},i:0,n:0,timers:[],queue:mode==='full'?buildFull():null,prev:null,gain:0,t0:Date.now()};
}
function saveSeen(){Store.d.seen=[...S.used.v,...S.used.l].slice(-400)}
function startFull(){newSession('full');step()}
function startPuzzle(){newSession('puz');step()}

function step(){
  clear();let spec;
  if(S.mode==='full'){
    if(S.i>=S.queue.length)return results();
    spec=S.queue[S.i];
    if(S.prev!==spec.dom){S.prev=spec.dom;S.pending=spec;return intro(spec.dom)}
  }else spec=nextPuzzle(Store.d.P);
  S.item=makeItem(spec,S.used);S.sel=null;draw();
}
function intro(id){
  const d=dinfo(id);
  set(`<div class="top"><button class="ic" data-a="quit" aria-label="${t('Quit')}">✕</button><div class="prog"><i style="width:${S.i/S.queue.length*100}%"></i></div></div>
  <div class="card" style="border-top:4px solid ${d.col}"><div class="tag">${t('Next section')}</div><h2>${d.name}</h2><p class="mut" style="margin-top:8px">${d.blurb}</p><p class="small mut" style="margin-top:8px">${t('Items get harder as you go. If you are unsure, give your best answer.')}</p></div>`+foot(`<button class="btn pri" data-a="begin">${t('Begin')}</button>`));
}
function hdr(){
  const d=S.item.dom;
  if(S.mode==='full')return`<div class="top"><button class="ic" data-a="quit" aria-label="${t('Quit')}">✕</button><div class="prog"><i style="width:${S.i/S.queue.length*100}%"></i></div><span class="chip">${d} ${S.i+1}/${S.queue.length}</span></div>`;
  const P=Store.d.P;
  return`<div class="top"><button class="ic" data-a="quit" aria-label="${t('Stop')}">✕</button><span class="chip">${d}</span><span class="mut small mono" style="flex:1;text-align:right">IQ ${puzIQ(P).toFixed(1)} · ${t('streak')} ${P.streak}</span></div>`;
}
function draw(){S.timedOut=false;S.t_in=0;S.t_item=Date.now();const t=S.item.type;t==='mc'?drawMC():t==='wm'?drawWM():drawSpeed()}

/* Per-answer log: [t,mode,dom,kind,level,ok,sec,timedOut,puzzleIQ,z,session] */
function logAns(ok,iq,z,sec){
  const it=S.item,L=Store.d.L||(Store.d.L=[]),t0=it.type==='wm'&&S.t_in?S.t_in:S.t_item;
  L.push([Math.round(Date.now()/1000),S.mode==='full'?'f':'p',it.dom,it.kind||'',it.d||0,ok?1:0,sec!=null?sec:+((Date.now()-t0)/1000).toFixed(1),S.timedOut?1:0,iq==null?'':iq,z==null?'':z,Math.round(S.t0/1000)]);
  if(L.length>4000)L.splice(0,L.length-4000);
}
/* Resolve one answered item (mc / wm) */
function answered(ok){
  clear();S.clk=null;const it=S.item;
  if(S.mode==='full'){S.rec[it.dom].items.push({b:it.b,c:it.c,ok});logAns(ok);S.n++;S.i++;step();return}
  puzResolve(ok);
}
function puzResolve(ok,dIQ){
  const it=S.item,P=Store.d.P;
  if(dIQ===undefined)dIQ=puzUpdate(P,it.dom,it.b,it.c,ok?1:0);
  P.total++;if(ok){P.right++;P.streak++;P.best=Math.max(P.best,P.streak)}else P.streak=0;
  P.hist.push([Math.round(Date.now()/1000),+puzIQ(P).toFixed(1)]);
  logAns(ok,+puzIQ(P).toFixed(1),it.type==='speed'?S.zlast:null,it.type==='speed'?it.dur:undefined);
  if(P.hist.length>800)P.hist.splice(0,P.hist.length-800);
  S.n++;S.gain+=dIQ;S.last={ok,dIQ,sec:(Date.now()-S.t_item)/1000};saveSeen();Store.save();
  if(!Store.d.set.fb){step();return}
  if(it.type==='mc')drawMC(true);else fbCard();
}
function fbBlock(){
  const L=S.last,P=Store.d.P;
  return`<div class="card fb"><div class="d ${L.ok?'good':'miss'}">${sgn(L.dIQ)}</div><h2>${t(S.item.type==='speed'?(L.ok?'Faster than typical':'Slower than typical'):L.ok?'Correct':S.timedOut?'Time’s up':'Incorrect')}</h2><p class="mut">${L.sec.toFixed(0)} s · ${t('Puzzle IQ')} <b class="mono" style="color:var(--ink)">${puzIQ(P).toFixed(1)}</b> · ${t('streak')} ${P.streak}</p></div>`;
}
const fbFoot=()=>foot(`<button class="btn" style="flex:1" data-a="stop">${t('Stop')}</button><button class="btn pri" style="flex:2" data-a="adv">${t('Next puzzle')}</button>`);
function fbCard(){set(hdr()+fbBlock()+fbFoot())}

/* ---- multiple choice ---- */
function drawMC(fb){
  const it=S.item,cls=it.layout==='list'?'':it.layout;
  const o=it.opts.map((h,i)=>{let c='opt';if(fb){if(i===it.a&&(S.sel===i||Store.d.set.show))c+=' right';else if(i===S.sel)c+=' wrong'}else if(i===S.sel)c+=' sel';return`<button class="${c}" ${fb?'disabled':`data-a="opt" data-i="${i}"`}>${h}</button>`}).join('');
  const sec=limitFor(it),tm=!fb&&timed();
  set(hdr()+(tm?clk(sec):'')+`<div class="card">${it.stim}</div><div class="opts ${cls}">${o}</div>`+(fb?fbBlock()+fbFoot():foot(`<button class="btn pri" id="nx" data-a="next" ${S.sel===null?'disabled':''}>${t(S.mode==='puz'?'Submit':'Next')}</button>`)));
  if(tm)startClock(sec,()=>answered(S.sel!==null&&S.sel===it.a));
}

/* ---- working memory ---- */
const WM_TXT=()=>({F:t('Repeat the digits in the same order.'),B:t('Enter the digits in reverse order.'),L:t('Enter the numbers from lowest to highest, then the letters in alphabetical order.')});
function drawWM(){
  const it=S.item;
  set(hdr()+`<div class="card"><div class="tag">${t('Working memory · {0} items',it.seq.length)}</div><p class="q">${WM_TXT()[it.kind]}</p><p class="small mut" style="margin-top:8px">${t('Items appear one at a time, then you type your answer. Do not write them down.')}</p></div>`+foot(`<button class="btn pri" data-a="wmgo">${t('Start')}</button>`));
}
function wmShow(){
  const it=S.item;
  set(hdr()+`<div class="card"><div class="tag">${t('Watch closely')}</div><div class="big" id="bg"></div></div>`);
  const bg=document.getElementById('bg');
  it.seq.forEach((ch,k)=>{later(()=>{bg.textContent=ch},400+k*1000);later(()=>{bg.textContent=''},1200+k*1000)});
  later(wmInput,400+it.seq.length*1000);
}
function wmInput(){
  const it=S.item,L=it.kind==='L';S.ent=[];
  const keys=L?'123456789BDFGHKLMPRST'.split(''):'0123456789'.split('');
  const sec=limitFor(it),tm=timed();S.t_in=Date.now();
  set(hdr()+(tm?clk(sec):'')+`<div class="card"><p class="small mut">${WM_TXT()[it.kind]}</p><div class="entry" id="en" style="margin-top:10px"></div></div><div class="keypad">${keys.map(k=>`<button class="key" data-a="key" data-k="${k}">${k}</button>`).join('')}</div>`+foot(`<button class="btn" style="flex:1" data-a="back">${t('Delete')}</button><button class="btn pri" style="flex:2" id="sb" data-a="wmsub" disabled>${t('Submit')}</button>`));
  updEn();
  if(tm)startClock(sec,()=>answered(S.ent.join('')===it.ans.join('')));
}
function updEn(){document.getElementById('en').innerHTML=S.ent.map(c=>`<span>${c}</span>`).join('');document.getElementById('sb').disabled=S.ent.length!==S.item.seq.length}

/* ---- processing speed ---- */
function drawSpeed(){
  const it=S.item,ttl=t(it.kind==='C'?'Symbol coding':'Symbol search'),
  x=t(it.kind==='C'?'Each symbol has a number. Tap the number that matches the symbol shown, as fast as you can without errors.':'Two target symbols are shown on the left. Tap YES if either one appears in the row on the right, otherwise NO.');
  set(hdr()+`<div class="card"><div class="tag">${t('{0} · {1} seconds',ttl,it.dur)}</div><p class="q">${x}</p></div>`+foot(`<button class="btn pri" data-a="spgo">${t('Start')}</button>`));
}
function speedRun(){
  const it=S.item;S.c=0;S.w=0;S.perm=shuf([0,1,2,3,4,5,6,7,8]);
  const keypad=it.kind==='C'?`<div class="keypad n3">${[1,2,3,4,5,6,7,8,9].map(k=>`<button class="key" style="height:60px" data-a="tap" data-k="${k}">${k}</button>`).join('')}</div>`:`<div class="opts grid2"><button class="opt" style="justify-content:center;min-height:64px" data-a="tap" data-k="1">${t('YES')}</button><button class="opt" style="justify-content:center;min-height:64px" data-a="tap" data-k="0">${t('NO')}</button></div>`;
  const key=it.kind==='C'?`<div class="keyrow" style="margin-top:12px">${S.perm.map((s,k)=>`<div>${symSVG(s)}${k+1}</div>`).join('')}</div>`:'';
  set(hdr()+`<div class="card"><div class="timer"><i id="tm" style="width:100%"></i></div>${key}<div id="tr" style="margin-top:12px"></div></div>${keypad}`);
  trial();
  const end=Date.now()+it.dur*1000;
  S.timers.push(setInterval(()=>{const l=end-Date.now();const tm=document.getElementById('tm');if(tm)tm.style.width=Math.max(0,l/(it.dur*10))+'%';if(l<=0){clear();speedDone()}},100));
}
function trial(){
  const tr=document.getElementById('tr');
  if(S.item.kind==='C'){S.cur=rnd(0,8);tr.innerHTML=`<div class="target">${symSVG(S.cur)}</div>`;return}
  const t=shuf([0,1,2,3,4,5,6,7,8]),tg=t.slice(0,2),rest=t.slice(2,7);S.has=Math.random()<.5;
  if(S.has)rest[rnd(0,4)]=pick(tg);
  tr.innerHTML=`<div class="srow">${tg.map(s=>symSVG(s)).join('')}<b class="mut">|</b>${rest.map(s=>symSVG(s)).join('')}</div>`;
}
function speedDone(){
  const it=S.item,n=PS_NORM[it.kind],net=S.c-S.w,z=clamp((net-n.m*it.dur)/(n.s*it.dur),-3,3);
  S.zlast=+z.toFixed(2);
  if(S.mode==='full'){S.rec.PSI.direct.push({z,se:1.3});logAns(z>=0,null,S.zlast,it.dur);S.n++;S.i++;step();return}
  const P=Store.d.P,before=puzIQ(P);P.th.PSI=clamp(P.th.PSI+.25*(z-P.th.PSI),-3.5,3.5);P.n.PSI++;
  puzResolve(z>=0,puzIQ(P)-before);
}

/* ---- full-test results ---- */
function results(){
  clear();const R=report(S.rec);
  if(!R.tested){set(`<div class="card"><h2>${t('No answers')}</h2></div>`+foot(`<button class="btn pri" data-a="go" data-t="test">${t('Back')}</button>`));return}
  const F=Store.d.F;F.push({t:Math.round(Date.now()/1000),fsiq:R.fsiq,lo:R.lo,hi:R.hi,m:Math.round((Date.now()-S.t0)/60000),dom:Object.fromEntries(Object.entries(R.dom).map(([k,v])=>[k,Math.round(v.iq)])),n:R.n});
  if(F.length>150)F.splice(0,F.length-150);
  saveSeen();Store.save();
  const pos=v=>(clamp(v,55,145)-55)/90*100,pct=R.pct<1?t('under 1'):R.pct>99?t('over 99'):Math.round(R.pct);
  const rows=DOM.map(d=>{const x=R.dom[d.id];return x?`<tr><td><span class="dot" style="background:${d.col};display:inline-block;margin-right:8px"></span>${d.name}<div class="mini"><i style="width:${pos(x.iq)}%;background:${d.col}"></i></div></td><td class="mono"><b>${Math.round(x.iq)}</b></td><td class="mono mut">±${Math.round(1.96*x.se)}</td></tr>`:''}).join('');
  S.copy=t('IQ Lab full test: FSIQ {0} (95% range {1}-{2}), {3}. ',R.fsiq,R.lo,R.hi,R.label)+DOM.filter(d=>R.dom[d.id]).map(d=>`${d.id} ${Math.round(R.dom[d.id].iq)}`).join(', ')+'. '+t('Uncalibrated estimate.');
  set(`<div class="card" style="text-align:center;padding:20px 16px"><div class="tag">${t('Full test · estimated IQ')}</div><div class="iq">${R.fsiq}</div><p style="margin-top:6px"><b>${R.label}</b></p><p class="small mut">${t('95% range {0}–{1}',R.lo,R.hi)} · ${t('above about {0}% of people if norms held',pct)} · ${Math.round((Date.now()-S.t0)/60000)} min</p>
  <div class="scale"><div class="tr"></div><div class="bd" style="left:${pos(R.lo)}%;width:${pos(R.hi)-pos(R.lo)}%"></div><div class="mk" style="left:${pos(R.fsiq)}%"></div></div><div class="ticks"><span>55</span><span>70</span><span>85</span><span>100</span><span>115</span><span>130</span><span>145</span></div></div>
  <div class="card" style="padding:12px 16px"><h3>${t('Index scores')}</h3><table><tr><th>${t('Domain')}</th><th>${t('Index')}</th><th>95%</th></tr>${rows}</table></div>
  <div class="card small mut" style="padding:14px 16px">${t('Not a norm-referenced or clinical score. Matrix, series and logic difficulty is anchored to ICAR data (1,525 people, a self-selected online sample). Verbal, rotation, memory and speed are not anchored. The range includes extra uncertainty from calibration.')}</div>`
  +foot(`<button class="btn" id="cp" data-a="copy">${t('Copy summary')}</button><button class="btn pri" data-a="go" data-t="stats">${t('See stats')}</button>`));
}

/* ---- actions ---- */
const sheet=h=>document.body.insertAdjacentHTML('beforeend',`<div class="sheet" id="sh"><div class="card">${h}</div></div>`);
const closeSheet=()=>{const s=document.getElementById('sh');if(s)s.remove()};
Object.assign(A,{
  begin(){S.item=makeItem(S.pending,S.used);S.sel=null;draw()},
  opt(t){S.sel=+t.dataset.i;document.querySelectorAll('.opt').forEach((o,i)=>o.classList.toggle('sel',i===S.sel));document.getElementById('nx').disabled=false},
  next(){if(S.sel!==null)answered(S.sel===S.item.a)},
  wmgo:wmShow,
  key(t){if(S.ent.length<S.item.seq.length){S.ent.push(t.dataset.k);updEn()}},
  back(){S.ent.pop();updEn()},
  wmsub(){answered(S.ent.join('')===S.item.ans.join(''))},
  spgo:speedRun,
  tap(t){const k=+t.dataset.k,it=S.item;let ok;if(it.kind==='C')ok=S.perm[k-1]===S.cur;else ok=(k===1)===S.has;ok?S.c++:S.w++;trial()},
  adv:step,
  quit(){if(S&&S.clk)S.clk.pause=Date.now();sheet(S.mode==='puz'?`<h3>${t('Stop here?')}</h3><p class="mut small">${t('Your puzzle IQ is saved after every answer.')}</p><button class="btn pri" data-a="stop">${t('Stop')}</button><button class="btn" data-a="keep">${t('Keep going')}</button>`:`<h3>${t('Leave the full test?')}</h3><p class="mut small">${t('Your answers so far will be lost.')}</p><button class="btn" data-a="keep">${t('Keep going')}</button><button class="btn pri" data-a="leave">${t('Leave')}</button>`)},
  keep(){closeSheet();if(S&&S.clk&&S.clk.pause){S.clk.end+=Date.now()-S.clk.pause;S.clk.pause=0}},
  stop(){closeSheet();clear();const g=S.gain,n=S.n;S=null;go('puz',{n,g})},
  leave(){closeSheet();clear();S=null;go('test')},
  copy(){copyTxt(document.getElementById('cp'),S.copy,t('Copied'))}
});
