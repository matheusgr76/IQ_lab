// Persistence: private per-user cloud doc (db capability) with a localStorage mirror. The UI never waits on the cloud for more than a few seconds.
const Store={d:null,ref:null,mode:'local',booted:false,late:false,noCloudWrite:false,_t:null,_busy:false,_again:false,
  blank(){return{v:1,seen:[],L:[],P:newPuz(),F:[],set:{fb:true,show:true,tl:true,ts:1}}},
  norm(d){
    const b=this.blank();d=Object.assign(b,d||{});
    d.P=Object.assign(newPuz(),d.P||{});d.set=Object.assign(b.set,d.set||{});
    if(!Array.isArray(d.F))d.F=[];if(!Array.isArray(d.seen))d.seen=[];
    return d;
  },
  score(d){return(d.P.total||0)+d.F.length*50},
  initLocal(){
    let d=null;try{d=JSON.parse(localStorage.getItem('iq-state')||'null')}catch(e){}
    this.d=this.norm(d);
  },
  async initCloud(){
    const tmo=(p,ms)=>Promise.race([Promise.resolve(p),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),ms))]);
    try{
      if(typeof claude==='undefined'||!claude.use)return;
      const u=await tmo(claude.use('user'),6000),id=u?await tmo(u.id(),6000):null,db=await tmo(claude.use('db'),6000);
      if(!db||!id)return;
      const ref=db.doc('data/users/'+id+'/state'),s=await tmo(ref.get(),8000);
      this.ref=ref;this.mode='cloud';
      if(s.exists){
        const c=this.norm(s.data());
        if(this.booted&&typeof S!=='undefined'&&S){this.noCloudWrite=true;return} // a session is running: do not swap data under it
        if(this.score(c)>=this.score(this.d)){this.d=c;this.late=this.booted;return}
      }
      this.save(); // cloud empty or behind: push local up
    }catch(e){this.mode='local'}
  },
  save(){try{localStorage.setItem('iq-state',JSON.stringify(this.d))}catch(e){}clearTimeout(this._t);this._t=setTimeout(()=>this.flush(),600)},
  async flush(){
    if(this._busy){this._again=true;return}
    this._busy=true;
    const body=JSON.parse(JSON.stringify(this.d));
    try{localStorage.setItem('iq-state',JSON.stringify(body))}catch(e){}
    if(this.ref&&!this.noCloudWrite){try{await this.ref.set(body);this.mode='cloud'}catch(e){this.mode='error'}}
    this._busy=false;
    if(this._again){this._again=false;this.flush()}
  }
};
