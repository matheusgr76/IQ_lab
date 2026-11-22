// SVG charts: radar (Lichess-style), line/area, bars. All colours come from CSS variables.
const AXK=['Verbal','Visual','Fluid','Memory','Speed'];const axl=i=>t(AXK[i]);
const LO=55,HI=145;
let _gid=0;
function radarSVG(series){
  const W=340,H=330,cx=170,cy=168,R=100,n=5,ang=i=>(-90+i*72)*Math.PI/180;
  const pt=(i,v)=>{const r=(Math.max(LO,Math.min(HI,v))-LO)/(HI-LO)*R;return[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))]};
  const ring=v=>Array.from({length:n},(_,i)=>pt(i,v).map(x=>x.toFixed(1)).join(',')).join(' ');
  let g='';
  [70,85,100,115,130,145].forEach(v=>{g+=`<polygon class="rg${v===100?' mid':''}" points="${ring(v)}"/>`});
  for(let i=0;i<n;i++){const[x,y]=pt(i,HI);g+=`<line class="rg" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`}
  [85,100,115].forEach(v=>{const[x,y]=pt(0,v);g+=`<text class="rl" x="${(x+4).toFixed(1)}" y="${(y+3).toFixed(1)}">${v}</text>`});
  series.forEach(s=>{
    const p=s.vals.map((v,i)=>pt(i,v==null?LO:v));
    g+=`<polygon points="${p.map(q=>q.map(x=>x.toFixed(1)).join(',')).join(' ')}" style="fill:${s.color};fill-opacity:.22;stroke:${s.color};stroke-width:2.5;stroke-linejoin:round"/>`;
    p.forEach((q,i)=>{if(s.vals[i]!=null)g+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="5.5" style="fill:${s.color}"/>`});
  });
  for(let i=0;i<n;i++){const a=ang(i),x=cx+(R+26)*Math.cos(a),y=cy+(R+22)*Math.sin(a)+4;g+=`<text class="ra" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${axl(i)}</text>`}
  return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Domain radar chart">${g}</svg>`;
}
function lineSVG(ys,o={}){
  const W=o.w||340,H=o.h||150,pl=o.axes===false?6:30,pr=8,pt=10,pb=o.axes===false?6:18;
  if(ys.length<2)return`<div class="empty" style="height:${H}px">${t('Answer a few puzzles to see your curve.')}</div>`;
  let lo=Math.min(...ys),hi=Math.max(...ys);const pad=Math.max(3,(hi-lo)*.15);lo=Math.floor(lo-pad);hi=Math.ceil(hi+pad);
  const X=i=>pl+i/(ys.length-1)*(W-pl-pr),Y=v=>pt+(1-(v-lo)/(hi-lo))*(H-pt-pb);
  const id='g'+(++_gid),pts=ys.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1));
  let g=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.color||'var(--acc)'}" stop-opacity=".45"/><stop offset="1" stop-color="${o.color||'var(--acc)'}" stop-opacity="0"/></linearGradient></defs>`;
  if(o.axes!==false)for(let k=0;k<4;k++){const v=lo+(hi-lo)*k/3;g+=`<line class="rg" x1="${pl}" x2="${W-pr}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text class="rl" x="2" y="${(Y(v)+3).toFixed(1)}">${Math.round(v)}</text>`}
  g+=`<polygon points="${X(0).toFixed(1)},${H-pb} ${pts.join(' ')} ${X(ys.length-1).toFixed(1)},${H-pb}" fill="url(#${id})"/>`;
  g+=`<polyline points="${pts.join(' ')}" style="fill:none;stroke:${o.color||'var(--acc)'};stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round"/>`;
  const lx=X(ys.length-1),ly=Y(ys[ys.length-1]);
  g+=`<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" style="fill:${o.color||'var(--acc)'}"/>`;
  if(o.labels)g+=`<text class="rl" x="${pl}" y="${H-3}">${o.labels[0]}</text><text class="rl" x="${W-pr}" y="${H-3}" text-anchor="end">${o.labels[1]}</text>`;
  return`<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function barsSVG(items){
  if(!items.length)return`<div class="empty" style="height:150px">${t('Take the full test to see your scores here.')}</div>`;
  const W=340,H=190,pl=30,pb=26,pt=14,lo=55,hi=145,Y=v=>pt+(1-(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo))*(H-pt-pb);
  const bw=Math.min(36,(W-pl-8)/items.length-8);let g='';
  [70,100,130].forEach(v=>g+=`<line class="rg" x1="${pl}" x2="${W-4}" y1="${Y(v)}" y2="${Y(v)}"/><text class="rl" x="2" y="${Y(v)+3}">${v}</text>`);
  items.forEach((it,i)=>{
    const x=pl+(i+.5)*((W-pl-4)/items.length);
    g+=`<rect x="${(x-bw/2).toFixed(1)}" y="${Y(it.v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(H-pb-Y(it.v)).toFixed(1)}" rx="4" style="fill:var(--acc)"/>`;
    g+=`<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Y(it.hi).toFixed(1)}" y2="${Y(it.lo).toFixed(1)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
    g+=`<text class="rv" x="${x.toFixed(1)}" y="${(Y(it.hi)-4).toFixed(1)}">${it.v}</text><text class="rl" x="${x.toFixed(1)}" y="${H-8}" text-anchor="middle">${it.label}</text>`;
  });
  return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Full test scores">${g}</svg>`;
}
