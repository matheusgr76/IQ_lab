// Item generators. Every item: {type,dom,d,b(difficulty),c(guess rate),...}
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const BL=[-1.6,-.8,0,.8,1.6];
// Difficulty shifts (SD units) anchoring generated item types to ICAR sample item difficulty (N=1,525; psychTools 'ability' data, 3PL fit).
// Matrix: ICAR matrix items mean b=+0.32. Series: letter/number series mean b=+0.04. Logic: ICAR verbal-reasoning mean b=-0.44.
// Verbal knowledge, rotation (ICAR is 3D, ours is 2D), working memory and speed have no ICAR anchor and stay unshifted.
const CAL={'VSI:M':.32,'FRI:S':.04,'FRI:T':.04,'FRI:O':-.44,'FRI:B':-.44};

function mcItem(dom,d,stim,opts,a,layout){
  const s=shuf(opts.map((h,i)=>({h,ok:i===a})));
  return{type:'mc',dom,d,b:BL[d-1],c:1/opts.length,stim,opts:s.map(x=>x.h),a:s.findIndex(x=>x.ok),layout:layout||'list'};
}
const txt=(tag,q)=>`<div class="tag">${tag}</div><p class="q">${q}</p>`;

/* ---------- Verbal & logic (static banks) ---------- */
function fromBank(bank,d,used,dom,tagOf){
  let pool=bank.filter(x=>x.d===d&&!used.has(x.id));
  if(!pool.length){bank.filter(x=>x.d===d).forEach(x=>used.delete(x.id));pool=bank.filter(x=>x.d===d)}
  const it=pick(pool);used.add(it.id);
  const r=mcItem(dom,d,txt(tagOf(it),it.q),it.o,it.a);r.tagk=tagOf(it);return r;
}

/* ---------- Fluid: number series ---------- */
function seriesGen(d){
  const r=rnd,P=[2,3,5,7,11,13,17,19];
  const G={
    1:[()=>{const a=r(1,9),k=r(2,7);return{N:7,f:i=>a+k*i}},()=>{const a=r(1,3);return{N:6,f:i=>a*2**i}}],
    2:[()=>{const a=r(1,4);return{N:6,f:i=>a*3**i}},()=>{const a=r(2,5),b=r(2,5),s=r(1,6);return{N:8,f:i=>s+Math.floor(i/2)*(a+b)+(i%2?a:0)}},()=>{const a=r(50,70),k=r(3,8);return{N:7,f:i=>a-k*i}}],
    3:[()=>{const s=r(1,5),d0=r(1,4),c=r(1,3);return{N:7,f:i=>s+i*d0+c*i*(i-1)/2}},()=>{const k=r(0,5);return{N:7,f:i=>(i+1)**2+k}}],
    4:[()=>{const a=r(1,6),k=r(2,5),b=r(40,60),m=r(3,7);return{N:9,f:i=>i%2?b-m*(i>>1):a+k*(i>>1)}},()=>{const x0=r(1,4),x1=r(2,5);return{N:7,arr:n=>{const x=[x0,x1];while(x.length<n)x.push(x[x.length-1]+x[x.length-2]);return x}}},()=>{const x0=r(1,4),k=pick([1,-1,2]);return{N:6,arr:n=>{const x=[x0];while(x.length<n)x.push(2*x[x.length-1]+k);return x}}}],
    5:[()=>{const x0=r(3,8),k=r(1,4);return{N:8,arr:n=>{const x=[x0];while(x.length<n)x.push(x.length%2?x[x.length-1]*2:x[x.length-1]-k);return x}}},()=>{const x0=r(1,5);return{N:8,arr:n=>{const x=[x0];while(x.length<n)x.push(x[x.length-1]+P[x.length-1]);return x}}},()=>{const x0=r(2,6),k=r(1,3);return{N:7,arr:n=>{const x=[x0];while(x.length<n)x.push(x.length%2?x[x.length-1]+k:x[x.length-1]*2);return x}}}]
  };
  for(let t=0;t<50;t++){
    const g=pick(G[d])();const arr=g.arr?g.arr(g.N):Array.from({length:g.N},(_,i)=>g.f(i));
    if(arr.every(v=>Math.abs(v)<3000)&&new Set(arr).size===arr.length)return arr;
  }
  return[2,4,6,8,10,12,14];
}
function genSeries(d){
  const arr=seriesGen(d),ans=arr[arr.length-1],shown=arr.slice(0,-1),last=shown[shown.length-1],dl=last-shown[shown.length-2];
  const c=[ans+1,ans-1,ans+2,ans-2,last+dl,last*2,ans+10,ans-10,ans+dl,last+1].filter(v=>v!==ans&&Math.abs(v)<5000);
  const opts=[ans,...shuf([...new Set(c)]).slice(0,4)];
  return mcItem('FRI',d,txt('Number series','Which number comes next?')+`<p class="big mono" style="font-size:26px;line-height:1.5;min-height:0;margin-top:10px;letter-spacing:0">${shown.join(', ')}, ?</p>`,opts.map(String),0,'grid3');
}

/* ---------- Visual: matrix reasoning ---------- */
const SHAPES=[3,4,5],ROTS=[0,25,50];
const poly=(cx,cy,r,n,rot)=>Array.from({length:n},(_,i)=>{const a=(rot-90+i*360/n)*Math.PI/180;return(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)}).join(' ');
function cellG(c,ox,oy){
  const pos=[[[30,30]],[[19,30],[41,30]],[[30,17],[18,41],[42,41]]][c[1]],r=[17,10,9.5][c[1]];
  return pos.map(p=>`<polygon class="f${c[2]}" points="${poly(ox+p[0],oy+p[1],r,SHAPES[c[0]],ROTS[c[3]])}"/>`).join('');
}
function genMatrix(d){
  const cfg=[['L1'],['L1','R'],['L1','L2'],['L1','L2','R'],['L1','L2','C','R']][d-1];
  const rule=[];shuf([0,1,2,3]).forEach((at,i)=>rule[at]=cfg[i]||'K');
  const perm=[0,1,2,3].map(()=>shuf([0,1,2]));
  const f={L1:(r,c)=>(r+c)%3,L2:(r,c)=>(r+2*c)%3,R:r=>r,C:(r,c)=>c,K:()=>0};
  const cell=(r,c)=>[0,1,2,3].map(at=>perm[at][f[rule[at]](r,c)]);
  const ans=cell(2,2),key=c=>c.join(''),seen=new Set([key(ans)]),opts=[ans];
  for(let g=0;opts.length<6&&g<300;g++){
    const c=ans.slice(),k=(d>=4&&rnd(0,1))?2:1;
    shuf([0,1,2,3]).slice(0,k).forEach(at=>{c[at]=(c[at]+rnd(1,2))%3});
    if(!seen.has(key(c))){seen.add(key(c));opts.push(c)}
  }
  let g='';
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const ox=c*65,oy=r*65;g+=`<rect class="cb" x="${ox}" y="${oy}" width="60" height="60" rx="6"/>`;g+=(r===2&&c===2)?`<text x="${ox+30}" y="${oy+40}">?</text>`:cellG(cell(r,c),ox,oy)}
  const stim=txt('Matrix reasoning','Which piece completes the pattern?')+`<svg class="fig" viewBox="0 0 190 190" style="max-width:300px;margin:12px auto 0">${g}</svg>`;
  return mcItem('VSI',d,stim,opts.map(c=>`<svg class="fig" viewBox="0 0 60 60">${cellG(c,0,0)}</svg>`),0,'grid3');
}

/* ---------- Visual: mental rotation ---------- */
const norm=cs=>{const mx=Math.min(...cs.map(p=>p[0])),my=Math.min(...cs.map(p=>p[1]));return cs.map(p=>[p[0]-mx,p[1]-my]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])};
const k2=cs=>norm(cs).join(';');
const rot90=cs=>norm(cs.map(([x,y])=>[y,-x])),mir=cs=>norm(cs.map(([x,y])=>[-x,y]));
const rotN=(cs,k)=>{for(let i=0;i<k;i++)cs=rot90(cs);return cs};
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
const conn=cs=>{const s=new Set(cs.map(p=>p+'')),seen=new Set([cs[0]+'']),st=[cs[0]];while(st.length){const[x,y]=st.pop();for(const[dx,dy]of DIRS){const k=[x+dx,y+dy]+'';if(s.has(k)&&!seen.has(k)){seen.add(k);st.push([x+dx,y+dy])}}}return seen.size===cs.length};
function polyo(n,g){let cs=[[rnd(0,g-1),rnd(0,g-1)]];while(cs.length<n){const[x,y]=pick(cs),[dx,dy]=pick(DIRS),nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=g||ny>=g||cs.some(p=>p[0]===nx&&p[1]===ny))continue;cs.push([nx,ny])}return norm(cs)}
const polySVG=(cs,u=13)=>{const w=Math.max(...cs.map(p=>p[0]))+1,h=Math.max(...cs.map(p=>p[1]))+1,ox=(70-w*u)/2,oy=(70-h*u)/2;return`<svg class="fig" viewBox="0 0 70 70">${cs.map(p=>`<rect class="sq" x="${ox+p[0]*u}" y="${oy+p[1]*u}" width="${u}" height="${u}"/>`).join('')}</svg>`};
function genRot(d){
  const n=[4,5,5,6,7][d-1],g=[3,4,4,4,5][d-1];let sh;
  for(let t=0;t<400;t++){sh=polyo(n,g);const m=[0,1,2,3].map(k=>k2(rotN(mir(sh),k)));if(!m.includes(k2(sh)))break}
  const seen=new Set([0,1,2,3].map(k=>k2(rotN(sh,k))));
  const correct=rotN(sh,rnd(1,3)),opts=[correct];
  const add=c=>{const k=k2(c);if(!seen.has(k)){seen.add(k);opts.push(c)}};
  shuf([0,1,2,3]).slice(0,2).forEach(k=>add(rotN(mir(sh),k)));
  for(let t=0;t<300&&opts.length<4;t++){
    const i=rnd(0,sh.length-1),rest=sh.filter((_,j)=>j!==i),[x,y]=pick(rest),[dx,dy]=pick(DIRS),np=[x+dx,y+dy];
    if(rest.some(p=>p[0]===np[0]&&p[1]===np[1]))continue;
    const cand=norm(rest.concat([np]));if(conn(cand))add(rotN(cand,rnd(0,3)));
  }
  for(let t=0;t<50&&opts.length<4;t++)add(rotN(mir(sh),rnd(0,3)));
  const stim=txt('Mental rotation','Which option is the shape below, turned but not flipped?')+`<div style="width:130px;margin:12px auto 0">${polySVG(sh,13)}</div>`;
  return mcItem('VSI',d,stim,opts.map(c=>polySVG(c)),0,'grid2');
}

/* ---------- Working memory ---------- */
const WM_LEN={F:[5,6,7,8,9],B:[3,4,5,6,7],L:[3,4,5,6,7]};
function genWM(kind,d){
  const n=WM_LEN[kind][d-1],D='123456789'.split(''),L='BDFGHKLMPRST'.split('');let seq,ans;
  if(kind==='L'){const nd=rnd(1,n-1),ds=shuf(D).slice(0,nd),ls=shuf(L).slice(0,n-nd);seq=shuf(ds.concat(ls));ans=ds.slice().sort().concat(ls.slice().sort())}
  else{seq=[];for(let i=0;i<n;i++){let x;do{x=String(rnd(0,9))}while(i&&x===seq[i-1]);seq.push(x)}ans=kind==='B'?seq.slice().reverse():seq.slice()}
  return{type:'wm',dom:'WMI',d,kind,seq,ans,b:BL[d-1],c:.02};
}

/* ---------- Processing speed ---------- */
const SYM=['<circle cx="12" cy="12" r="8"/>','<path d="M12 4v16M4 12h16"/>','<path d="M5 5l14 14M19 5L5 19"/>','<path d="M12 4l9 16H3z"/>','<rect x="5" y="5" width="14" height="14"/>','<path d="M12 3l9 9-9 9-9-9z"/>','<path d="M6 4v16h12"/>','<path d="M4 7l8 10 8-10"/>','<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'];
const symSVG=(i,cls)=>`<svg class="fig sym ${cls||''}" viewBox="0 0 24 24" style="color:var(--ink)">${SYM[i]}</svg>`;
// provisional norms: mean/SD of net correct per second on a phone
const PS_NORM={C:{m:.55,s:.15},S:{m:.5,s:.15}};

/* ---------- Factory ---------- */
function makeItem(s,used){const it=makeItem0(s,used),sh=CAL[s.dom+':'+s.kind];if(sh)it.b+=sh;if(!it.kind)it.kind=s.dom==='VCI'?(it.tagk||'Verbal'):(s.kind||'');return it}
const KN={'VSI:M':'Matrix','VSI:R':'Rotation','FRI:S':'Number series','FRI:T':'Letter series','FRI:O':'Ordering','FRI:B':'Logic','WMI:F':'Digits forward','WMI:B':'Digits backward','WMI:L':'Letter-number','PSI:C':'Symbol coding','PSI:S':'Symbol search'};
const kname=(d,k)=>d==='VCI'?(k||'Verbal'):(KN[d+':'+k]||k||d);
function makeItem0(s,used){
  switch(s.dom){
    case'VCI':return fromBank(VERBAL,s.d,used.v,'VCI',x=>x.t);
    case'VSI':return s.kind==='R'?genRot(s.d):genMatrix(s.d);
    case'FRI':return s.kind==='B'?fromBank(LOGIC,s.d,used.l,'FRI',()=>'Logic'):s.kind==='O'?genOrder(s.d):s.kind==='T'?genLetters(s.d):genSeries(s.d);
    case'WMI':return genWM(s.kind,s.d);
    default:return{type:'speed',dom:'PSI',kind:s.kind,dur:s.dur};
  }
}
