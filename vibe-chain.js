/* V2 links retain the full arrival-ordered group in the URL fragment only. */
const VibeChain=(()=>{
  // ponytail: 64 people / 16 KiB keeps links and local group work bounded; use shared storage before raising this ceiling.
  const MAX_MEMBERS=64,MAX_HASH=16384,ANSWER_COUNT=12;
  function member(value){
    if(!value||!Array.isArray(value.a)||value.a.length!==ANSWER_COUNT||value.a.some(x=>!Number.isInteger(x)||x<0||x>3))throw new Error('Invalid answers');
    if(typeof value.name!=='string'||Array.from(value.name).length>14||!['m','f','x'].includes(value.g))throw new Error('Invalid participant');
    return {a:value.a.slice(),name:value.name,g:value.g};
  }
  function members(values){
    if(!Array.isArray(values)||values.length>MAX_MEMBERS)throw new Error('This chain is full');
    return values.map(member);
  }
  function read(hash){
    try{
      if(typeof hash!=='string'||hash.length>MAX_HASH)throw new Error('Invalid link');
      const p=new URLSearchParams(hash.replace(/^#/,''));
      if(p.has('v')||p.has('c')){
        if(p.getAll('v').length!==1||p.get('v')!=='2'||p.getAll('c').length!==1)throw new Error('Invalid version');
        const encoded=p.get('c');
        if(!encoded||!/^[A-Za-z0-9_-]+$/.test(encoded))throw new Error('Invalid payload');
        const bytes=Uint8Array.from(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
        const payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
        if(!Array.isArray(payload)||!payload.length||payload.length>MAX_MEMBERS)throw new Error('Invalid group');
        const decoded=payload.map(row=>{
          if(!Array.isArray(row)||row.length!==3||typeof row[0]!=='string'||!/^[0-3]{12}$/.test(row[0]))throw new Error('Invalid participant');
          return {a:Array.from(row[0],Number),name:row[1],g:row[2]};
        });
        return {members:members(decoded),error:null,legacyHops:0};
      }
      if(!p.has('a'))return {members:[],error:null,legacyHops:0};
      if(p.getAll('a').length!==1||!/^[0-3]{12}$/.test(p.get('a')))throw new Error('Invalid legacy answers');
      const name=Array.from(p.get('n')||'').slice(0,14).join('');
      const hops=Number(p.get('h')||0);
      return {members:[member({a:Array.from(p.get('a'),Number),name,g:['m','f'].includes(p.get('g'))?p.get('g'):'x'})],error:null,legacyHops:Number.isFinite(hops)?Math.min(999,Math.max(0,Math.floor(hops))):0};
    }catch{return {members:[],error:'This chain link is incomplete or invalid. Start a new vibe check to play.',legacyHops:0}}
  }
  function write(values){
    const group=members(values);
    if(!group.length)throw new Error('No completed participants');
    const payload=JSON.stringify(group.map(p=>[p.a.join(''),p.name,p.g]));
    const binary=Array.from(new TextEncoder().encode(payload),b=>String.fromCharCode(b)).join('');
    const hash='#v=2&c='+btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    if(hash.length>MAX_HASH)throw new Error('This chain link is too long');
    return hash;
  }
  function append(previous,current){
    const group=members(previous);
    if(group.length>=MAX_MEMBERS)throw new Error('This chain is full');
    group.push(member(current));return group;
  }
  function dynamics(values,questions,score,match){
    const group=members(values);
    if(group.length<3)throw new Error('Group dynamics needs at least three people');
    const profiles=group.map(p=>score(p.a).v);
    const shares=[0,0,0,0];
    for(const profile of profiles){const total=profile.reduce((s,x)=>s+x,0);profile.forEach((x,i)=>shares[i]+=total?x/total/group.length:1/4/group.length)}
    const raw=shares.map(x=>x*100),energy=raw.map(Math.floor);
    const remainder=100-energy.reduce((a,b)=>a+b,0);
    raw.map((x,i)=>({i,f:x-energy[i]})).sort((a,b)=>b.f-a.f||a.i-b.i).slice(0,remainder).forEach(({i})=>energy[i]++);
    let closest={left:0,right:1,percent:match(group[0].a,group[1].a)};
    for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
      const percent=match(group[i].a,group[j].a);
      if(percent>closest.percent)closest={left:i,right:j,percent};
    }
    const shared=questions.flatMap((q,i)=>q.a===undefined&&group.every(p=>p.a[i]===group[0].a[i])?[i]:[]);
    return {energy,leadAxis:shares.indexOf(Math.max(...shares)),closest,shared};
  }
  return {MAX_MEMBERS,MAX_HASH,read,write,append,dynamics};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=VibeChain;
