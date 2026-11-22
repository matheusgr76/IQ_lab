// Tabbed shell: Home, Puzzles, Test, Stats, More. Dark smart-home-style wireframe.
const IC={
  home:'<path d="M3 11l9-8 9 8v10H3z"/>',
  puz:'<path d="M4 4h6v3a2 2 0 104 0V4h6v6h-3a2 2 0 100 4h3v6H4z"/>',
  test:'<path d="M9 3h6v3H9zM6 5h12v16H6zM9 11h6M9 15h6"/>',
  stats:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
};
const svgI=(k,c)=>`<svg class="${c||''}" viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
let TAB='home';const ST={radar:'both'};
const TITLES=()=>({home:'IQ Lab',puz:t('Puzzles'),test:t('Full test'),stats:t('Stats'),more:t('More')});
const langPill=()=>`<div class="lang" role="group" aria-label="Language">${['en','pt'].map(l=>`<button class="${LANG===l?'on':''}" data-a="lang" data-l="${l}" aria-pressed="${LANG===l}">${l.toUpperCase()}</button>`).join('')}</div>`;
const fmtD=x=>new Date(x*1000).toLocaleDateString(LANG==='pt'?'pt-BR':undefined,{day:'2-digit',month:'short'});
const lastF=()=>{const F=Store.d.F;return F.length?F[F.length-1]:null};
const pVals=()=>{const P=Store.d.P;return DOM.map(d=>P.n[d.id]?100+15*P.th[d.id]:null)};
const fVals=()=>{const f=lastF();return DOM.map(d=>f&&f.dom[d.id]!=null?f.dom[d.id]:null)};
const lvl=v=>v>=122.5?0:v>=107.5?1:v>=92.5?2:v>=77.5?3:4;
const LCOL=['var(--ok)','#9bd35a','#f2c94c','#f2994a','var(--bad)'];

function shell(body){
  const tabs=['home','puz','test','stats','more'].map(k=>`<button class="tab ${k===TAB?'on':''}" data-a="go" data-t="${k}">${svgI(k)}<span>${t({home:'Home',puz:'Puzzles',test:'Test',stats:'Stats',more:'More'}[k])}</span></button>`).join('');
  set(`<div class="hdr">${TAB==='home'?langPill():`<button class="rb" data-a="go" data-t="home" aria-label="${t('Home')}">‹</button>`}<h1>${TITLES()[TAB]}</h1><button class="rb" data-a="go" data-t="more" aria-label="${t('More')}">⋯</button></div>${body}<nav class="tabs"><div>${tabs}</div></nav>`);
}
const meters=vals=>`<div class="meters">${DOM.map((d,i)=>{const v=vals[i],L=v==null?-1:lvl(v);return`<div class="meter"><div class="dots">${[0,1,2,3,4].map(k=>`<i class="${k===L?'on':''}" style="${k===L?'background:'+LCOL[k]:''}"></i>`).join('')}</div><b class="mono">${v==null?'–':Math.round(v)}</b><span>${axl(i)}</span></div>`}).join('')}</div>`;

function pageHome(){
  const P=Store.d.P,f=lastF(),ys=P.hist.slice(-60).map(h=>h[1]),iq=puzIQ(P);
  const dl=P.hist.length>1?iq-P.hist[Math.max(0,P.hist.length-21)][1]:0;
  shell(`<div class="chips"><span class="pill"><span class="dot" style="background:var(--ok)"></span>${t('Streak {0}',P.streak)}</span><span class="pill">${t('{0} answered',P.total)}</span></div>
  <div class="card clim"><div class="t">${t('Puzzle IQ')}</div><div class="n mono">${iq.toFixed(1)}<small>${P.hist.length>1?sgn(dl)+' '+t('last 20'):''}</small></div>${lineSVG(ys,{axes:false,h:110,color:'var(--rad)'})}${meters(pVals())}</div>
  <div class="sec">${t('Train')}</div>
  <div class="tiles"><button class="tile" data-a="startpuz">${svgI('puz','ti')}<b>${t('Puzzles')}</b><span>${t('Adaptive')} · IQ ${iq.toFixed(0)}</span></button><button class="tile" data-a="go" data-t="test">${svgI('test','ti')}<b>${t('Full test')}</b><span>${f?t('Last {0}',f.fsiq)+' · '+fmtD(f.t):t('50 tasks · not taken yet')}</span></button></div>
  <div class="sec">${t('Profile')}</div><div class="card" style="padding:14px 8px">${radarSVG([{vals:pVals(),color:'var(--rad)'}])}</div>`);
}
function pagePuz(o){
  const P=Store.d.P,pct=P.total?Math.round(P.right/P.total*100):0;
  shell((o&&o.n?`<div class="card" style="padding:14px 18px"><b>${t('Session done')}</b><p class="mut small">${t('{0} puzzles · {1} IQ',o.n,sgn(o.g))}</p></div>`:'')+
  `<div class="card"><div class="stat3"><div><span>${t('Puzzle IQ')}</span><b class="mono">${puzIQ(P).toFixed(0)}</b></div><div><span>${t('Played')}</span><b class="mono">${P.total}</b></div><div><span>${t('Solved')}</span><b class="mono">${pct}%</b></div></div>
  <div style="padding:10px 6px">${radarSVG([{vals:pVals(),color:'var(--rad)'}])}</div></div>
  <p class="small mut">${t('Right answers raise your IQ, wrong or timed-out ones lower it. Hard puzzles move it more. Do one or as many as you like; it saves after every answer.')}</p>
  <button class="btn pri" data-a="startpuz">${t('Start puzzle')}</button>`);
}
function pageTest(){
  const F=Store.d.F,f=lastF();
  shell(`<div class="card" style="padding:18px"><h3>${t('Full IQ test')}</h3><p class="mut small" style="margin:8px 0 14px">${t("50 tasks, 10 per domain, easy to hard. Every question is timed; time's up counts as a miss. About 35–45 minutes. Sit somewhere quiet, no notes, no calculator. No feedback until the end.")}</p><button class="btn pri" data-a="startfull">${t('Start full test')}</button></div>
  ${f?`<div class="card" style="padding:16px;text-align:center"><div class="tag">${t('Latest result · {0}',fmtD(f.t))}</div><div class="iq" style="font-size:56px">${f.fsiq}</div><p class="small mut">${t('95% range {0}–{1}',f.lo,f.hi)}</p></div>`:''}
  <div class="sec">${t('History')}</div><div class="card list hist">${F.length?F.slice().reverse().map(x=>`<div class="row"><div><b class="mono">${x.fsiq}</b><span>${fmtD(x.t)} · ${t('range {0}–{1}',x.lo,x.hi)}</span></div><span class="mono">${x.m?x.m+' min':t('{0} tasks',x.n)}</span></div>`).join(''):`<div class="empty" style="padding:24px">${t('No full tests yet.')}</div>`}</div>`);
}

function logRows(s){return(Store.d.L||[]).filter(r=>s==='both'||(s==='puz'?r[1]==='p':r[1]==='f'))}
function weakHTML(s){
  const L=logRows(s);
  if(!L.length)return`<div class="sec">${t('Weak spots')}</div><div class="card"><p class="small mut" style="padding:6px 4px">${t('Answer a few questions and this table fills in: accuracy, difficulty level reached and speed for each question type.')}</p></div>`;
  const g={};L.forEach(r=>{const k=r[2]+'|'+r[3],a=g[k]||(g[k]={d:r[2],k:r[3],n:0,ok:0,lv:0,nl:0,sec:0,to:0,z:0,nz:0});a.n++;a.ok+=r[5];if(r[4]){a.lv+=r[4];a.nl++}a.sec+=r[6];a.to+=r[7];if(r[9]!==''){a.z+=r[9];a.nz++}});
  const rows=Object.values(g).sort((x,y)=>(x.ok/x.n)-(y.ok/y.n));
  const body=rows.map(a=>{const acc=Math.round(100*a.ok/a.n),dm=DOM.find(d=>d.id===a.d);
    const mid=a.d==='PSI'?(a.nz?'z'+(a.z/a.nz>=0?'+':'−')+Math.abs(a.z/a.nz).toFixed(1):'–'):(a.nl?(a.lv/a.nl).toFixed(1):'–');
    return`<tr style="${a.n<5?'opacity:.55':''}"><td>${t(kname(a.d,a.k))}<div class="small mut">${dm?dm.name:a.d}</div></td><td class="mono">${a.n}</td><td class="mono">${a.d==='PSI'?'–':acc+'%'}</td><td class="mono">${mid}</td><td class="mono">${Math.round(a.sec/a.n)}s</td><td class="mono">${a.d==='PSI'?'–':Math.round(100*a.to/a.n)+'%'}</td></tr>`}).join('');
  const H=[[t('Night 0–6'),0,6],[t('Day 6–18'),6,18],[t('Evening 18–24'),18,24]];
  const tod=H.map(([n,a,b])=>{const x=L.filter(r=>{const h=new Date(r[0]*1000).getHours();return h>=a&&h<b&&r[2]!=='PSI'});return x.length?`<tr><td>${n}</td><td class="mono">${x.length}</td><td class="mono">${Math.round(100*x.reduce((t,r)=>t+r[5],0)/x.length)}%</td><td class="mono">${Math.round(x.reduce((t,r)=>t+r[6],0)/x.length)}s</td></tr>`:''}).join('');
  return`<div class="sec">${t('Weak spots')}</div><div class="card" style="padding:6px 12px"><table><tr><th>${t('Type')}</th><th>n</th><th>${t('Acc')}</th><th>${t('Lvl')}</th><th>${t('Time')}</th><th>${t('Out')}</th></tr>${body}</table><p class="small mut" style="padding:4px 4px 8px">${t('Weakest first. Lvl is the average difficulty (1–5); in Puzzles, accuracy stays near 60% by design, so read Lvl. Faded rows have fewer than 5 answers.')}</p></div>
  <div class="sec">${t('Time of day')}</div><div class="card" style="padding:6px 12px"><table><tr><th>${t('When')}</th><th>n</th><th>${t('Acc')}</th><th>${t('Time')}</th></tr>${tod}</table><p class="small mut" style="padding:4px 4px 8px">${t('Excludes speed tasks. Compare only when both rows have 30+ answers.')}</p></div>`;
}
function csvText(){
  const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v,pad=n=>String(n).padStart(2,'0');
  const H=['datetime','mode','session','domain','type','level','correct','seconds','timed_out','puzzle_iq_after','speed_z'];
  const rows=(Store.d.L||[]).map(r=>{const d=new Date(r[0]*1000),ses=new Date(r[10]*1000);
    return[`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,r[1]==='f'?'full':'puzzle',`${ses.getFullYear()}-${pad(ses.getMonth()+1)}-${pad(ses.getDate())} ${pad(ses.getHours())}:${pad(ses.getMinutes())}`,r[2],kname(r[2],r[3]),r[4]||'',r[5],r[6],r[7],r[8],r[9]].map(q).join(',')});
  return[H.join(',')].concat(rows).join('\n');
}
function copyTxt(b,txt,done){const fb=()=>{try{const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();b.textContent=ok?done:t('Blocked')}catch(e){b.textContent=t('Blocked')}};try{navigator.clipboard.writeText(txt).then(()=>{b.textContent=done},fb)}catch(e){fb()}}
function pageStats(){
  const P=Store.d.P,F=Store.d.F,s=ST.radar;
  const ser=[];if(s!=='full')ser.push({vals:pVals(),color:'var(--rad)'});if(s!=='puz')ser.push({vals:fVals(),color:'var(--rad2)'});
  const ys=P.hist.slice(-150).map(h=>h[1]);
  const bars=F.slice(-10).map(x=>({v:x.fsiq,lo:x.lo,hi:x.hi,label:fmtD(x.t)}));
  const fv=fVals(),pv=pVals();
  shell(`<div class="seg">${[['both',t('Both')],['puz',t('Puzzles')],['full',t('Full test')]].map(([k,l])=>`<button class="${s===k?'on':''}" data-a="seg" data-k="${k}">${l}</button>`).join('')}</div>
  <div class="card" style="padding:14px 8px">${radarSVG(ser)}<div class="legend"><span><i style="background:var(--rad)"></i>${t('Puzzles')}</span><span><i style="background:var(--rad2)"></i>${t('Full test')}</span></div></div>
  <div class="sec">${t('Puzzle IQ over time')}</div><div class="card" style="padding:14px 10px">${lineSVG(ys,{h:160,color:'var(--rad)',labels:[t('older'),t('latest')]})}</div>
  <div class="sec">${t('Full test scores')}</div><div class="card" style="padding:14px 10px">${barsSVG(bars)}<p class="small mut" style="text-align:center">${t('Bars: FSIQ. Whiskers: 95% range.')}</p></div>
  ${weakHTML(s)}
  <div class="sec">${t('By domain')}</div><div class="card" style="padding:6px 16px"><table><tr><th>${t('Domain')}</th><th>${t('Puzzle')}</th><th>${t('Full')}</th></tr>${DOM.map((d,i)=>`<tr><td>${d.name}</td><td class="mono">${pv[i]==null?'–':Math.round(pv[i])}</td><td class="mono">${fv[i]==null?'–':Math.round(fv[i])}</td></tr>`).join('')}</table></div>
  <div class="sec">${t('Your data')}</div><div class="card" style="padding:14px 16px"><p class="small mut" style="margin-bottom:12px">${t('Bring in results exported from IQ Lab, from this or another phone.')}</p><button class="btn" data-a="imp">${t('Import previous results')}</button></div>`);
}
function pageMore(){
  const c=Store.d.set,m=Store.mode,msg=t({cloud:'Saved to your private cloud database',local:'Saved on this device only',error:'Cloud save failed; saved on this device'}[m]||'Saved on this device only');
  const row=(k,ti,su)=>`<div class="row"><div><b>${ti}</b><span>${su}</span></div><button class="sw ${c[k]?'on':''}" data-a="tog" data-k="${k}" role="switch" aria-checked="${!!c[k]}" aria-label="${ti}"></button></div>`;
  const btn=(a,l,id,k)=>`<button class="btn" style="width:auto" ${id?`id="${id}" `:''}data-a="${a}"${k?` data-k="${k}"`:''}>${l}</button>`;
  shell(`<div class="sec">${t('Language')}</div><div class="card list"><div class="row"><div><b>${t('Language')}</b><span>English · Português</span></div>${langPill()}</div></div>
  <div class="sec">${t('Puzzle settings')}</div><div class="card list">${row('tl',t('Time limits'),t('Countdown per question; time’s up counts as a miss'))}<div class="row"><div><b>${t('Time allowance')}</b><span>${t('Applies to puzzles and the full test')}</span></div></div><div class="seg" style="margin:0 0 10px">${[[1.5,t('Relaxed')],[1,t('Standard')],[.75,t('Strict')]].map(([k,l])=>`<button class="${(c.ts||1)===k?'on':''}" data-a="tscale" data-k="${k}">${l}</button>`).join('')}</div>${row('fb',t('Feedback after each puzzle'),t('Show IQ change and result'))}${row('show',t('Show the correct answer'),t('After a miss'))}</div>
  <div class="sec">${t('Data')}</div><div class="card list"><div class="row"><div><b>${t('Storage')}</b><span>${msg}</span></div></div><div class="row"><div><b>${t('Export')}</b><span>${t('Copy everything as JSON (full backup)')}</span></div>${btn('export',t('Copy'),'ex')}</div><div class="row"><div><b>${t('Export answers (CSV)')}</b><span>${t('One row per answer, {0} logged. Paste into Sheets or Excel',(Store.d.L||[]).length)}</span></div>${btn('exportcsv',t('Copy'),'exc')}</div><div class="row"><div><b>${t('Import')}</b><span>${t('Paste scores copied with Export')}</span></div>${btn('imp',t('Paste'))}</div><div class="row"><div><b>${t('Reset puzzle IQ')}</b><span>${t('Back to 100, keeps the full test history')}</span></div>${btn('askreset',t('Reset'),'','puz')}</div><div class="row"><div><b>${t('Reset everything')}</b><span>${t('Puzzle IQ, test history, seen questions')}</span></div>${btn('askreset',t('Reset'),'','all')}</div></div>
  <div class="sec">${t('Calibration')}</div><div class="card list"><div class="row"><div><b>${t('ICAR-anchored')}</b><span>${t('Matrix +0.3, series 0, logic −0.4 SD, from ICAR sample data (N = 1,525, GPL-licensed psychTools). Verbal, rotation, memory and speed are not anchored.')}</span></div></div></div>
  <p class="small mut">${t('Estimates only. Not normed on a population sample and not a clinical assessment.')}</p>`);
}
const PAGES={home:pageHome,puz:pagePuz,test:pageTest,stats:pageStats,more:pageMore};
function go(t,o){TAB=t;PAGES[t](o)}

Object.assign(A,{
  go(el){go(el.dataset.t)},startpuz:startPuzzle,startfull:startFull,
  lang(el){Store.d.set.lang=el.dataset.l;setLang(el.dataset.l);Store.save();go(TAB)},
  tscale(el){Store.d.set.ts=+el.dataset.k;Store.save();pageMore()},
  seg(el){ST.radar=el.dataset.k;pageStats()},
  tog(el){const k=el.dataset.k;Store.d.set[k]=!Store.d.set[k];Store.save();pageMore()},
  export(){copyTxt(document.getElementById('ex'),JSON.stringify(Store.d),t('Copied'))},
  exportcsv(){copyTxt(document.getElementById('exc'),csvText(),t('Copied'))},
  imp(){sheet(`<h3>${t('Import results')}</h3><p class="mut small">${t('Paste the JSON copied with Export. Merge adds missing tests and answers and keeps the puzzle IQ that has more answers. Replace overwrites the scores on this device.')}</p><textarea id="imt" style="width:100%;height:110px;background:var(--tile);color:var(--ink);border:0;border-radius:10px;padding:8px;box-sizing:border-box;-webkit-user-select:text;user-select:text" placeholder="${t('Paste here')}"></textarea><p class="small" id="ime" style="color:#ff8a80;min-height:18px"></p><button class="btn pri" data-a="doimp" data-k="merge">${t('Merge with current')}</button><button class="btn" data-a="doimp" data-k="replace">${t('Replace current')}</button><button class="btn" data-a="keep">${t('Cancel')}</button>`)},
  doimp(el){const e=document.getElementById('ime');try{const j=JSON.parse(document.getElementById('imt').value);if(!j||!j.P||!Array.isArray(j.F))throw 0;Store.importData(j,el.dataset.k);closeSheet();go(TAB)}catch(x){e.textContent=t('That is not valid exported data.')}},
  askreset(el){const all=el.dataset.k==='all';sheet(`<h3>${t(all?'Reset everything?':'Reset puzzle IQ?')}</h3><p class="mut small">${t('This cannot be undone.')}</p><button class="btn pri" data-a="doreset" data-k="${el.dataset.k}">${t('Reset')}</button><button class="btn" data-a="keep">${t('Cancel')}</button>`)},
  doreset(el){closeSheet();if(el.dataset.k==='all'){const s=Store.d.set;Store.d=Store.blank();Store.d.set=s}else Store.d.P=newPuz();Store.save();pageMore()}
});
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(el&&A[el.dataset.a])A[el.dataset.a](el)});
window.addEventListener('error',e=>{if(!Store.booted)set(`<div class="card"><h3>${t('Something broke')}</h3><p class="small mut">${e.message}</p></div>`)});
(async()=>{
  set(`<div class="empty" style="min-height:60vh">${t('Loading your scores…')}</div>`);
  Store.initLocal();if(Store.d.set.lang)setLang(Store.d.set.lang);else setLang(LANG);
  const cloud=Store.initCloud();
  await Promise.race([cloud,new Promise(r=>setTimeout(r,4000))]);
  Store.booted=true;go('home');
  cloud.then(()=>{if(Store.late&&!S){if(Store.d.set.lang)setLang(Store.d.set.lang);go(TAB)}});
})();
