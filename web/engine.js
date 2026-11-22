// Scoring: 3PL-style IRT with Bayesian (EAP) estimate per domain, then a weighted composite.
const DOM=[
 {id:'VCI',get name(){return t('Verbal Comprehension')},w:.25,col:'var(--d0)',get blurb(){return t('Vocabulary, similarities, general knowledge, analogies.')}},
 {id:'VSI',get name(){return t('Visual Spatial')},w:.2,col:'var(--d1)',get blurb(){return t('Matrix puzzles and mental rotation of shapes.')}},
 {id:'FRI',get name(){return t('Fluid Reasoning')},w:.25,col:'var(--d2)',get blurb(){return t('Number series and logic problems.')}},
 {id:'WMI',get name(){return t('Working Memory')},w:.15,col:'var(--d3)',get blurb(){return t('Digits forward and backward, number-letter sequencing.')}},
 {id:'PSI',get name(){return t('Processing Speed')},w:.15,col:'var(--d4)',get blurb(){return t('Symbol coding and symbol search against the clock.')}}
];
const A_DISC=1.2;
// Extra uncertainty (SD units) from item calibration: smaller where ICAR anchors exist, larger where none do (judgement values).
const CALU={VCI:.5,VSI:.3,FRI:.2,WMI:.5,PSI:.5};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const emptyRec=()=>Object.fromEntries(DOM.map(d=>[d.id,{items:[],direct:[]}]));

function eap(rec){
  let Z=0,m=0,rows=[];
  for(let t=-4;t<=4.0001;t+=.05){
    let ll=-t*t/2;
    for(const it of rec.items){const p=it.c+(1-it.c)/(1+Math.exp(-A_DISC*(t-it.b)));ll+=Math.log(it.ok?p:1-p)}
    for(const d of rec.direct)ll-=(t-d.z)**2/(2*d.se*d.se);
    const w=Math.exp(ll);rows.push([t,w]);Z+=w;m+=t*w;
  }
  m/=Z;const v=rows.reduce((s,r)=>s+(r[0]-m)**2*r[1],0)/Z;
  return{theta:m,se:Math.sqrt(v)};
}
const phi=z=>{const t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p};
const iqOf=t=>clamp(100+15*t,40,160);
function band(iq){return t(iq>=130?'Very superior range':iq>=120?'Superior range':iq>=110?'High average range':iq>=90?'Average range':iq>=80?'Low average range':iq>=70?'Borderline range':'Extremely low range')}

function report(rec){
  const out={dom:{},tested:0,n:0};let sw=0,st=0,sv=0;
  for(const d of DOM){
    const r=rec[d.id],n=r.items.length+r.direct.length;if(!n)continue;
    const e=eap(r),se=Math.sqrt(e.se**2+CALU[d.id]**2);out.dom[d.id]={n,iq:iqOf(e.theta),se:se*15,theta:e.theta};
    out.tested++;out.n+=n;sw+=d.w;st+=d.w*e.theta;sv+=(d.w*se)**2;
  }
  if(!out.tested)return out;
  const k=out.tested>=3?1.25:1.1,th=st/sw*k;
  out.fsiq=iqOf(th);out.se=Math.sqrt(sv)/sw*k*15;
  const half=Math.max(1.96*out.se,4);
  out.lo=Math.round(clamp(out.fsiq-half,40,160));out.hi=Math.round(clamp(out.fsiq+half,40,160));
  out.fsiq=Math.round(out.fsiq);out.pct=phi((out.fsiq-100)/15)*100;out.label=band(out.fsiq);
  out.conf=out.tested<5?'Partial: '+out.tested+' of 5 domains tested':out.n<35?'Low: few items answered':'Standard';
  return out;
}

/* ---------- Test plans ---------- */
const LV=[1,1,2,2,3,3,4,4,5,5];
function buildFull(){
  const q=[];
  LV.forEach(d=>q.push({dom:'VCI',d}));
  LV.forEach((d,i)=>q.push({dom:'VSI',d,kind:i%2?'R':'M'}));
  const fk=['S','O','T','B','S','O','T','S','O','B'];
  LV.forEach((d,i)=>q.push({dom:'FRI',d,kind:fk[i]}));
  const wk=['F','B','L','F','B','L','F','B','L','B'];
  LV.forEach((d,i)=>q.push({dom:'WMI',d,kind:wk[i]}));
  for(let i=0;i<10;i++)q.push({dom:'PSI',kind:i%2?'S':'C',dur:15});
  return q; // 50 tasks
}
/* ---------- Puzzle mode: Elo-style rating per domain ---------- */
const newPuz=()=>({th:Object.fromEntries(DOM.map(d=>[d.id,0])),n:Object.fromEntries(DOM.map(d=>[d.id,0])),hist:[],right:0,total:0,streak:0,best:0});
function puzIQ(P){let s=0,w=0;for(const d of DOM){s+=d.w*P.th[d.id];w+=d.w}return clamp(100+15*s/w,40,160)}
function nextPuzzle(P){
  const wt=DOM.map(d=>(d.id==='PSI'?.4:1)/(1+P.n[d.id]/12));
  let x=Math.random()*wt.reduce((a,b)=>a+b),i=0;while(x>wt[i]){x-=wt[i];i++}
  const dom=DOM[Math.min(i,4)].id;
  if(dom==='PSI')return{dom,kind:pick(['C','S']),dur:15};
  const tgt=P.th[dom]+(Math.random()-.5)*1.0;
  let d=1,best=9;BL.forEach((b,k)=>{if(Math.abs(b-tgt)<best){best=Math.abs(b-tgt);d=k+1}});
  const kind={VSI:pick(['M','R']),FRI:pick(['S','T','O','B']),WMI:pick(['F','B','L'])}[dom];
  return{dom,d,kind};
}
function puzUpdate(P,dom,b,c,score){
  const th=P.th[dom],p=c+(1-c)/(1+Math.exp(-A_DISC*(th-b))),before=puzIQ(P);
  const K=P.n[dom]<10?.45:P.n[dom]<30?.3:.2;
  P.th[dom]=clamp(th+K*(score-p),-3.5,3.5);P.n[dom]++;
  return puzIQ(P)-before;
}
