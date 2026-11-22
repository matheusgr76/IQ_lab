// Parsed banks + extra generators (ordering puzzles, letter series). Loaded after gen.js.
const TAGS={V:'Vocabulary',S:'Similarities',K:'Knowledge',A:'Analogy'};
const hid=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return(h>>>0).toString(36)};
const VERBAL=RAW.map(l=>{const p=l.split('|');return{id:'v'+hid(p[1]),t:TAGS[p[0]],q:p[1],o:p.slice(2,6),a:0,d:+p[6]}});
const LOGIC=LRAW.map(l=>{const p=l.split('|');return{id:'l'+hid(p[0]),q:p[0],o:p.slice(1,5),a:0,d:+p[5]}});

const NAMES=['Ana','Bruno','Carla','Diego','Elisa','Fábio','Gina','Hugo','Iris','Joel','Kira','Leo','Mara','Nuno'];
const ADJ=[['taller','shorter','tallest','shortest'],['older','younger','oldest','youngest'],['faster','slower','fastest','slowest'],['heavier','lighter','heaviest','lightest']];
function genOrder(d){
  const n=[3,4,4,5,6][d-1],nm=shuf(NAMES).slice(0,n),A=pick(ADJ);
  const st=[];
  for(let i=0;i<n-1;i++)st.push((d>=3&&rnd(0,1))?`${nm[i+1]} is ${A[1]} than ${nm[i]}.`:`${nm[i]} is ${A[0]} than ${nm[i+1]}.`);
  const q=[`Who is the ${A[3]}?`,`Who is the ${A[2]}?`,`Who is the second ${A[2]}?`,`Who is exactly in the middle?`,`Who is the third ${A[3]}?`][d-1];
  const ans=[nm[n-1],nm[0],nm[1],nm[2],nm[n-3]][d-1];
  let opts=[ans,...shuf(nm.filter(x=>x!==ans)).slice(0,3)];
  if(opts.length<4)opts.push('Cannot tell');
  return mcItem('FRI',d,txt('Logic','Read the statements, then answer.')+`<p class="q" style="margin-top:10px">${shuf(st).join(' ')}</p><p class="q" style="margin-top:10px"><b>${q}</b></p>`,opts,0,'list');
}

const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function genLetters(d){
  for(let t=0;t<100;t++){
    const r=rnd;let arr=[];const s0=r(0,6);
    if(d===1){const k=r(1,3);arr=Array.from({length:6},(_,i)=>s0+k*i)}
    else if(d===2){const a=r(1,2),b=r(2,4);arr=Array.from({length:7},(_,i)=>s0+Math.floor(i/2)*(a+b)+(i%2?a:0))}
    else if(d===3){arr=[s0];for(let i=1;i<7;i++)arr.push(arr[i-1]+i)}
    else if(d===4){const k=r(1,3),m=r(1,3),b=r(12,20);arr=Array.from({length:9},(_,i)=>i%2?b-m*(i>>1):s0+k*(i>>1))}
    else{const a=r(3,4),b=r(1,2);arr=[s0];for(let i=1;i<9;i++)arr.push(arr[i-1]+(i%2?a:-b))}
    if(arr.every(v=>v>=0&&v<26)){
      const ans=arr.pop(),last=arr[arr.length-1];
      const c=shuf([ans+1,ans-1,ans+2,ans-2,last+1,last-1,ans+3].filter(v=>v>=0&&v<26&&v!==ans));
      return mcItem('FRI',d,txt('Letter series','Which letter comes next?')+`<p class="big mono" style="font-size:26px;line-height:1.5;min-height:0;margin-top:10px;letter-spacing:.05em">${arr.map(v=>LET[v]).join(' ')} ?</p>`,[ans,...c.slice(0,4)].map(v=>LET[v]),0,'grid3');
    }
  }
  return genSeries(d);
}
