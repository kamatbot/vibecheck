/* V3 is pinned to the immutable candidate bank/engine v1. Legacy answers stay on V2. */
const PreferenceQuiz=(()=>{
  const D=typeof module!=='undefined'&&module.exports?require('./preferences/data-v1.js'):PreferenceData;
  const E=typeof module!=='undefined'&&module.exports?require('./preferences/engine-v1.js'):PreferenceEngine;
  const Legacy=typeof module!=='undefined'&&module.exports?require('./vibe-chain.js'):VibeChain;
  const {bank,manifest}=D,MAX_MEMBERS=64,MAX_HASH=16384;
  const assert=(ok,message)=>{if(!ok)throw new Error(message)};
  const index=new Map(bank.map((q,i)=>[q.id,i]));
  E.validateBank(bank,manifest);
  const randomId=()=>Array.from(crypto.getRandomValues(new Uint32Array(2)),x=>x.toString(16)).join('-');
  const newPanel=()=>['A','B','C'][crypto.getRandomValues(new Uint32Array(1))[0]%3];
  const newStyle=()=>Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x%4);
  const validPanel=p=>assert(['A','B','C'].includes(p),'Unknown question panel');
  function copy(p){
    assert(p&&typeof p.name==='string'&&Array.from(p.name).length<=14&&['m','f','x'].includes(p.g),'Invalid participant');
    for(const key of ['a','q','r'])assert(Array.isArray(p[key])&&p[key].length===12,'Incomplete participant');
    assert(Array.from(p.a).every(x=>Number.isInteger(x)&&x>=0&&x<=3),'Invalid style');
    assert(Array.from(p.q).every(x=>Number.isInteger(x)&&x>=0&&x<bank.length),'Unknown question');
    assert(Array.from(p.r).every(x=>['a','b','c','d'].includes(x)),'Unknown answer');
    assert(p.o===0||p.o===1,'Invalid option orientation');
    return {name:p.name,g:p.g,a:p.a.slice(),q:p.q.slice(),r:p.r.slice(),o:p.o};
  }
  function sessionFor(p,panel='A'){
    validPanel(panel);
    const anchors=new Set(manifest.selection.anchor_panels[panel]);
    return {bank_version:manifest.bank_version,bank_sha256:manifest.item_file_sha256,
      scale_id:manifest.scale_id,scoring_version:manifest.scoring_version,calibration_version:null,
      session_id:'shared',anchor_panel:panel,items:p.q.map((i,position)=>{
        const q=bank[i];return {question_id:q.id,question_version:q.version,dimension:q.dimension,facet:q.facet,
          presented_position:position,display_option_ids:p.o?['d','c','b','a']:['a','b','c','d'],is_anchor:anchors.has(q.id)};
      })};
  }
  const responsesFor=p=>p.q.map((i,j)=>({question_id:bank[i].id,question_version:bank[i].version,option_id:p.r[j]}));
  function rawProfile(value){const p=copy(value);return E.scoreSession(bank,manifest,sessionFor(p),responsesFor(p))}
  function checked(value){const p=copy(value);rawProfile(p);return p}
  function members(values){assert(Array.isArray(values)&&values.length<=MAX_MEMBERS,'This chain is full');return Array.from(values,checked)}
  const encode=text=>btoa(Array.from(new TextEncoder().encode(text),b=>String.fromCharCode(b)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  function decode(text){
    assert(typeof text==='string'&&/^[A-Za-z0-9_-]+$/.test(text),'Invalid link payload');
    return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(text.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
  }
  function read(hash){
    const empty={edition:'preferences',panel:'A',members:[],error:null,legacyHops:0};
    try{
      assert(typeof hash==='string'&&hash.length<=MAX_HASH,'Invalid link');
      const params=new URLSearchParams(hash.replace(/^#/,''));
      if(params.get('v')==='3'){
        assert(params.getAll('v').length===1&&params.getAll('c').length===1,'Invalid link');
        const payload=JSON.parse(decode(params.get('c')));
        assert(Array.isArray(payload)&&payload.length===3&&payload[0]===1,'Unknown quiz edition');
        validPanel(payload[1]);
        assert(Array.isArray(payload[2])&&payload[2].length>0&&payload[2].length<=MAX_MEMBERS,'Invalid group');
        const decoded=payload[2].map(row=>{
          assert(Array.isArray(row)&&row.length===5,'Invalid participant');
          const [name,g,packed,style,o]=row;
          assert(typeof packed==='string'&&packed.length===24&&/^[A-Za-z0-9_-]+$/.test(packed),'Invalid answers');
          assert(typeof style==='string'&&/^[0-3]{12}$/.test(style),'Invalid style');
          const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',q=[],r=[];
          for(let i=0;i<24;i+=2){const value=alphabet.indexOf(packed[i])*64+alphabet.indexOf(packed[i+1]);q.push(Math.floor(value/4));r.push('abcd'[value%4])}
          return {name,g,a:Array.from(style,Number),q,r,o};
        });
        return {...empty,panel:payload[1],members:members(decoded)};
      }
      const legacy=Legacy.read(hash);
      if(legacy.error)return {...empty,error:legacy.error};
      if(legacy.members.length)return {...legacy,edition:'legacy',panel:'A'};
      return {...empty,panel:newPanel()};
    }catch{return {...empty,error:'This quiz link is incomplete or uses an unsupported edition. Start a new chain to play.'}}
  }
  function write(values,panel){
    validPanel(panel);const group=members(values);assert(group.length>0,'No completed participants');
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const rows=group.map(p=>[p.name,p.g,p.q.map((q,i)=>{const v=q*4+'abcd'.indexOf(p.r[i]);return alphabet[Math.floor(v/64)]+alphabet[v%64]}).join(''),p.a.join(''),p.o]);
    const hash='#v=3&c='+encode(JSON.stringify([1,panel,rows]));
    assert(hash.length<=MAX_HASH,'This chain link is too long');return hash;
  }
  function append(previous,current){const group=members(previous);assert(group.length<MAX_MEMBERS,'This chain is full');group.push(checked(current));return group}
  function createSession(panel,previous=[]){
    validPanel(panel);const group=members(previous);assert(group.length<MAX_MEMBERS,'This chain is full');
    return E.assembleSession(bank,manifest,{chainId:'panel-'+panel,sessionId:randomId(),participantId:randomId(),anchorPanel:panel,priorSessions:group.map(p=>sessionFor(p,panel))});
  }
  function question(session,position){
    const row=session.items[position],q=bank[index.get(row.question_id)];
    return {id:q.id,prompt:q.prompt,context:q.context,options:row.display_option_ids.map(id=>{const option=q.options.find(o=>o.id===id);return {id,text:option.text}})};
  }
  const swap=(session,position,responses)=>E.swapUnansweredItem(bank,manifest,session,session.items[position].question_id,responses);
  function member(session,responses,name,g,style){
    const result=E.scoreSession(bank,manifest,session,responses);assert(result.status==='provisional_snapshot','Finish all 12 questions');
    const answers=new Map(responses.map(r=>[r.question_id,r.option_id]));
    return checked({name,g,a:style,q:session.items.map(row=>index.get(row.question_id)),r:session.items.map(row=>answers.get(row.question_id)),o:session.option_orientation==='descending'?1:0});
  }
  function profile(p){
    const raw=rawProfile(p);return {...raw,axes:E.DIMENSIONS.map(key=>{const d=manifest.dimensions[key],a=raw.axes[key];return {key,label:d.label,low:d.low_pole,high:d.high_pole,band:a.band,value:a.value}})};
  }
  function compare(a,b){
    const A=rawProfile(a),B=rawProfile(b),comparison=E.compareProfiles(A,B,manifest);
    const label=(key,band)=>band==='low'?manifest.dimensions[key].low_pole:band==='high'?manifest.dimensions[key].high_pole:'A bit of both';
    return {score:comparison.display_score,summary:'A snapshot of your quiz preferences, not a friendship prediction.',axes:E.DIMENSIONS.map(key=>({label:manifest.dimensions[key].label,left:label(key,A.axes[key].band),right:label(key,B.axes[key].band),gap:comparison.axis_gaps[key]}))};
  }
  function group(values){
    const ps=members(values),result=E.summarizeGroup(ps.map((p,i)=>({id:String(i),share_profile:true,profile:rawProfile(p)})),manifest);
    return {total:result.total_participants,suggestions:result.suggestions,axes:E.DIMENSIONS.map(key=>{const d=manifest.dimensions[key];return {key,label:d.label,low:d.low_pole,high:d.high_pole,...result.axes[key]}})};
  }
  return {MAX_MEMBERS,MAX_HASH,read,write,append,createSession,question,swap,member,profile,compare,group,newPanel,newStyle};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PreferenceQuiz;
