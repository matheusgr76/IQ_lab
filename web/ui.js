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
const TITLES={home:'IQ Lab',puz:'Puzzles',test:'Full test',stats:'Stats',more:'More'};
const fmtD=t=>new Date(t*1000).toLocaleDateString(undefined,{day:'2-digit',month:'short'});
const lastF=()=>{const F=Store.d.F;return F.length?F[F.length-1]:null};
const pVals=()=>{const P=Store.d.P;return DOM.map(d=>P.n[d.id]?100+15*P.th[d.id]:null)};
const fVals=()=>{const f=lastF();return DOM.map(d=>f&&f.dom[d.id]!=null?f.dom[d.id]:null)};
const lvl=v=>v>=122.5?0:v>=107.5?1:v>=92.5?2:v>=77.5?3:4;
const LCOL=['var(--ok)','#9bd35a','#f2c94c','#f2994a','var(--bad)'];

function shell(body){
  const tabs=['home','puz','test','stats','more'].map(k=>`<button class="tab ${k===TAB?'on':''}" data-a="go" data-t="${k}">${svgI(k)}<span>${k==='puz'?'Puzzles':k==='test'?'Test':k[0].toUpperCase()+k.slice(1)}</span></button>`).join('');
  set(`<div class="hdr">${TAB==='home'?'<span></span>':`<button class="rb" data-a="go" data-t="home" aria-label="Home">‹</button>`}<h1>${TITLES[TAB]}</h1><button class="rb" data-a="go" data-t="more" aria-label="More">⋯</button></div>${body}<nav class="tabs"><div>${tabs}</div></nav>`);
}
const meters=vals=>`<div class="meters">${DOM.map((d,i)=>{const v=vals[i],L=v==null?-1:lvl(v);return`<div class="meter"><div class="dots">${[0,1,2,3,4].map(k=>`<i class="${k===L?'on':''}" style="${k===L?'background:'+LCOL[k]:''}"></i>`).join('')}</div><b class="mono">${v==null?'–':Math.round(v)}</b><span>${AX[i]}</span></div>`}).join('')}</div>`;

function pageHome(){
  const P=Store.d.P,f=lastF(),ys=P.hist.slice(-60).map(h=>h[1]),iq=puzIQ(P);
  const dl=P.hist.length>1?iq-P.hist[Math.max(0,P.hist.length-21)][1]:0;
  shell(`<div class="chips"><span class="pill"><span class="dot" style="background:var(--ok)"></span>Streak ${P.streak}</span><span class="pill">${P.total} answered</span></div>
  <div class="card clim"><div class="t">Puzzle IQ</div><div class="n mono">${iq.toFixed(1)}<small>${P.hist.length>1?sgn(dl)+' last 20':''}</small></div>${lineSVG(ys,{axes:false,h:110,color:'var(--rad)'})}${meters(pVals())}</div>
  <div class="sec">Train</div>
  <div class="tiles"><button class="tile" data-a="startpuz">${svgI('puz','ti')}<b>Puzzles</b><span>Adaptive · IQ ${iq.toFixed(0)}</span></button><button class="tile" data-a="go" data-t="test">${svgI('test','ti')}<b>Full test</b><span>${f?'Last '+f.fsiq+' · '+fmtD(f.t):'50 tasks · not taken yet'}</span></button></div>
  <div class="sec">Profile</div><div class="card" style="padding:14px 8px">${radarSVG([{vals:pVals(),color:'var(--rad)'}])}</div>`);
}
function pagePuz(o){
  const P=Store.d.P,pct=P.total?Math.round(P.right/P.total*100):0;
  shell((o&&o.n?`<div class="card" style="padding:14px 18px"><b>Session done</b><p class="mut small">${o.n} puzzles · ${sgn(o.g)} IQ</p></div>`:'')+
  `<div class="card"><div class="stat3"><div><span>Puzzle IQ</span><b class="mono">${puzIQ(P).toFixed(0)}</b></div><div><span>Played</span><b class="mono">${P.total}</b></div><div><span>Solved</span><b class="mono">${pct}%</b></div></div>
  <div style="padding:10px 6px">${radarSVG([{vals:pVals(),color:'var(--rad)'}])}</div></div>
  <p class="small mut">Right answers raise your IQ, wrong or timed-out ones lower it. Hard puzzles move it more. Do one or as many as you like; it saves after every answer.</p>
  <button class="btn pri" data-a="startpuz">Start puzzle</button>`);
}
function pageTest(){
  const F=Store.d.F,f=lastF();
  shell(`<div class="card" style="padding:18px"><h3>Full IQ test</h3><p class="mut small" style="margin:8px 0 14px">50 tasks, 10 per domain, easy to hard. Every question is timed; time's up counts as a miss. About 35–45 minutes. Sit somewhere quiet, no notes, no calculator. No feedback until the end.</p><button class="btn pri" data-a="startfull">Start full test</button></div>
  ${f?`<div class="card" style="padding:16px;text-align:center"><div class="tag">Latest result · ${fmtD(f.t)}</div><div class="iq" style="font-size:56px">${f.fsiq}</div><p class="small mut">95% range ${f.lo}–${f.hi}</p></div>`:''}
  <div class="sec">History</div><div class="card list hist">${F.length?F.slice().reverse().map(x=>`<div class="row"><div><b class="mono">${x.fsiq}</b><span>${fmtD(x.t)} · range ${x.lo}–${x.hi}</span></div><span class="mono">${x.m?x.m+' min':x.n+' tasks'}</span></div>`).join(''):'<div class="empty" style="padding:24px">No full tests yet.</div>'}</div>`);
}

function logRows(s){return(Store.d.L||[]).filter(r=>s==='both'||(s==='puz'?r[1]==='p':r[1]==='f'))}
function weakHTML(s){
  const L=logRows(s);
  if(!L.length)return`<div class="sec">Weak spots</div><div class="card"><p class="small mut" style="padding:6px 4px">Answer a few questions and this table fills in: accuracy, difficulty level reached and speed for each question type.</p></div>`;
  const g={};L.forEach(r=>{const k=r[2]+'|'+r[3],a=g[k]||(g[k]={d:r[2],k:r[3],n:0,ok:0,lv:0,nl:0,sec:0,to:0,z:0,nz:0});a.n++;a.ok+=r[5];if(r[4]){a.lv+=r[4];a.nl++}a.sec+=r[6];a.to+=r[7];if(r[9]!==''){a.z+=r[9];a.nz++}});
  const rows=Object.values(g).sort((x,y)=>(x.ok/x.n)-(y.ok/y.n));
  const body=rows.map(a=>{const acc=Math.round(100*a.ok/a.n),dm=DOM.find(d=>d.id===a.d);
    const mid=a.d==='PSI'?(a.nz?'z'+(a.z/a.nz>=0?'+':'−')+Math.abs(a.z/a.nz).toFixed(1):'–'):(a.nl?(a.lv/a.nl).toFixed(1):'–');
    return`<tr style="${a.n<5?'opacity:.55':''}"><td>${kname(a.d,a.k)}<div class="small mut">${dm?dm.name:a.d}</div></td><td class="mono">${a.n}</td><td class="mono">${a.d==='PSI'?'–':acc+'%'}</td><td class="mono">${mid}</td><td class="mono">${Math.round(a.sec/a.n)}s</td><td class="mono">${a.d==='PSI'?'–':Math.round(100*a.to/a.n)+'%'}</td></tr>`}).join('');
  const H=[['Night 0–6',0,6],['Day 6–18',6,18],['Evening 18–24',18,24]];
  const tod=H.map(([n,a,b])=>{const x=L.filter(r=>{const h=new Date(r[0]*1000).getHours();return h>=a&&h<b&&r[2]!=='PSI'});return x.length?`<tr><td>${n}</td><td class="mono">${x.length}</td><td class="mono">${Math.round(100*x.reduce((t,r)=>t+r[5],0)/x.length)}%</td><td class="mono">${Math.round(x.reduce((t,r)=>t+r[6],0)/x.length)}s</td></tr>`:''}).join('');
  return`<div class="sec">Weak spots</div><div class="card" style="padding:6px 12px"><table><tr><th>Type</th><th>n</th><th>Acc</th><th>Lvl</th><th>Time</th><th>Out</th></tr>${body}</table><p class="small mut" style="padding:4px 4px 8px">Weakest first. Lvl is the average difficulty (1–5); in Puzzles, accuracy stays near 60% by design, so read Lvl. Faded rows have fewer than 5 answers.</p></div>
  <div class="sec">Time of day</div><div class="card" style="padding:6px 12px"><table><tr><th>When</th><th>n</th><th>Acc</th><th>Time</th></tr>${tod}</table><p class="small mut" style="padding:4px 4px 8px">Excludes speed tasks. Compare only when both rows have 30+ answers.</p></div>`;
}
function csvText(){
  const q=v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v,pad=n=>String(n).padStart(2,'0');
  const H=['datetime','mode','session','domain','type','level','correct','seconds','timed_out','puzzle_iq_after','speed_z'];
  const rows=(Store.d.L||[]).map(r=>{const d=new Date(r[0]*1000),ses=new Date(r[10]*1000);
    return[`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,r[1]==='f'?'full':'puzzle',`${ses.getFullYear()}-${pad(ses.getMonth()+1)}-${pad(ses.getDate())} ${pad(ses.getHours())}:${pad(ses.getMinutes())}`,r[2],kname(r[2],r[3]),r[4]||'',r[5],r[6],r[7],r[8],r[9]].map(q).join(',')});
  return[H.join(',')].concat(rows).join('\n');
}
function copyTxt(b,txt,done){const fb=()=>{try{const t=document.createElement('textarea');t.value=txt;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();b.textContent=ok?done:'Blocked'}catch(e){b.textContent='Blocked'}};try{navigator.clipboard.writeText(txt).then(()=>{b.textContent=done},fb)}catch(e){fb()}}
function pageStats(){
  const P=Store.d.P,F=Store.d.F,s=ST.radar;
  const ser=[];if(s!=='full')ser.push({vals:pVals(),color:'var(--rad)'});if(s!=='puz')ser.push({vals:fVals(),color:'var(--rad2)'});
  const ys=P.hist.slice(-150).map(h=>h[1]);
  const bars=F.slice(-10).map(x=>({v:x.fsiq,lo:x.lo,hi:x.hi,label:fmtD(x.t)}));
  const fv=fVals(),pv=pVals();
  shell(`<div class="seg">${[['both','Both'],['puz','Puzzles'],['full','Full test']].map(([k,l])=>`<button class="${s===k?'on':''}" data-a="seg" data-k="${k}">${l}</button>`).join('')}</div>
  <div class="card" style="padding:14px 8px">${radarSVG(ser)}<div class="legend"><span><i style="background:var(--rad)"></i>Puzzles</span><span><i style="background:var(--rad2)"></i>Full test</span></div></div>
  <div class="sec">Puzzle IQ over time</div><div class="card" style="padding:14px 10px">${lineSVG(ys,{h:160,color:'var(--rad)',labels:['older','latest']})}</div>
  <div class="sec">Full test scores</div><div class="card" style="padding:14px 10px">${barsSVG(bars)}<p class="small mut" style="text-align:center">Bars: FSIQ. Whiskers: 95% range.</p></div>
  ${weakHTML(s)}
  <div class="sec">By domain</div><div class="card" style="padding:6px 16px"><table><tr><th>Domain</th><th>Puzzle</th><th>Full</th></tr>${DOM.map((d,i)=>`<tr><td>${d.name}</td><td class="mono">${pv[i]==null?'–':Math.round(pv[i])}</td><td class="mono">${fv[i]==null?'–':Math.round(fv[i])}</td></tr>`).join('')}</table></div>`);
}
function pageMore(){
  const c=Store.d.set,m=Store.mode,msg={cloud:'Saved to your private cloud database',local:'Saved on this device only',error:'Cloud save failed; saved on this device'}[m]||'';
  const row=(k,t,s)=>`<div class="row"><div><b>${t}</b><span>${s}</span></div><button class="sw ${c[k]?'on':''}" data-a="tog" data-k="${k}" role="switch" aria-checked="${!!c[k]}" aria-label="${t}"></button></div>`;
  shell(`<div class="sec">Puzzle settings</div><div class="card list">${row('tl','Time limits','Countdown per question; time’s up counts as a miss')}<div class="row"><div><b>Time allowance</b><span>Applies to puzzles and the full test</span></div></div><div class="seg" style="margin:0 0 10px">${[[1.5,'Relaxed'],[1,'Standard'],[.75,'Strict']].map(([k,l])=>`<button class="${(c.ts||1)===k?'on':''}" data-a="tscale" data-k="${k}">${l}</button>`).join('')}</div>${row('fb','Feedback after each puzzle','Show IQ change and result')}${row('show','Show the correct answer','After a miss')}</div>
  <div class="sec">Data</div><div class="card list"><div class="row"><div><b>Storage</b><span>${msg}</span></div></div><div class="row"><div><b>Export</b><span>Copy everything as JSON (full backup)</span></div><button class="btn" style="width:auto" id="ex" data-a="export">Copy</button></div><div class="row"><div><b>Export answers (CSV)</b><span>One row per answer, ${(Store.d.L||[]).length} logged. Paste into Sheets or Excel</span></div><button class="btn" style="width:auto" id="exc" data-a="exportcsv">Copy</button></div><div class="row"><div><b>Import</b><span>Paste scores copied with Export</span></div><button class="btn" style="width:auto" data-a="imp">Paste</button></div><div class="row"><div><b>Reset puzzle IQ</b><span>Back to 100, keeps the full test history</span></div><button class="btn" style="width:auto" data-a="askreset" data-k="puz">Reset</button></div><div class="row"><div><b>Reset everything</b><span>Puzzle IQ, test history, seen questions</span></div><button class="btn" style="width:auto" data-a="askreset" data-k="all">Reset</button></div></div>
  <div class="sec">Calibration</div><div class="card list"><div class="row"><div><b>ICAR-anchored</b><span>Matrix +0.3, series 0, logic −0.4 SD, from ICAR sample data (N = 1,525, GPL-licensed psychTools). Verbal, rotation, memory and speed are not anchored.</span></div></div></div>
  <p class="small mut">Estimates only. Not normed on a population sample and not a clinical assessment.</p>`);
}
const PAGES={home:pageHome,puz:pagePuz,test:pageTest,stats:pageStats,more:pageMore};
function go(t,o){TAB=t;PAGES[t](o)}

Object.assign(A,{
  go(t){go(t.dataset.t)},startpuz:startPuzzle,startfull:startFull,
  tscale(t){Store.d.set.ts=+t.dataset.k;Store.save();pageMore()},
  seg(t){ST.radar=t.dataset.k;pageStats()},
  tog(t){const k=t.dataset.k;Store.d.set[k]=!Store.d.set[k];Store.save();pageMore()},
  export(){copyTxt(document.getElementById('ex'),JSON.stringify(Store.d),'Copied')},
  exportcsv(){copyTxt(document.getElementById('exc'),csvText(),'Copied')},
  imp(){sheet(`<h3>Import scores</h3><p class="mut small">Paste the JSON from Export. It replaces the scores on this device.</p><textarea id="imt" style="width:100%;height:110px;background:var(--tile);color:var(--fg,#fff);border:0;border-radius:10px;padding:8px;box-sizing:border-box" placeholder="Paste here"></textarea><p class="small" id="ime" style="color:#ff8a80;min-height:18px"></p><button class="btn pri" data-a="doimp">Import</button><button class="btn" data-a="keep">Cancel</button>`)},
  doimp(){const e=document.getElementById('ime');try{const j=JSON.parse(document.getElementById('imt').value);if(!j||!j.P||!Array.isArray(j.F))throw 0;Store.d=Store.norm(j);Store.save();closeSheet();pageMore()}catch(x){e.textContent='That is not valid exported data.'}},
  askreset(t){const all=t.dataset.k==='all';sheet(`<h3>${all?'Reset everything?':'Reset puzzle IQ?'}</h3><p class="mut small">This cannot be undone.</p><button class="btn pri" data-a="doreset" data-k="${t.dataset.k}">Reset</button><button class="btn" data-a="keep">Cancel</button>`)},
  doreset(t){closeSheet();if(t.dataset.k==='all'){const s=Store.d.set;Store.d=Store.blank();Store.d.set=s}else Store.d.P=newPuz();Store.save();pageMore()}
});
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(t&&A[t.dataset.a])A[t.dataset.a](t)});
window.addEventListener('error',e=>{if(!Store.booted)set(`<div class="card"><h3>Something broke</h3><p class="small mut">${e.message}</p></div>`)});
(async()=>{
  set('<div class="empty" style="min-height:60vh">Loading your scores…</div>');
  Store.initLocal();
  const cloud=Store.initCloud();
  await Promise.race([cloud,new Promise(r=>setTimeout(r,4000))]);
  Store.booted=true;go('home');
  cloud.then(()=>{if(Store.late&&!S)go(TAB)});
})();
