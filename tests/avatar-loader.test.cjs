const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.slice(html.indexOf('const GLB_BASE_URL='),html.indexOf('loadGLB().catch'));
function glb(length=12){const b=new ArrayBuffer(length),d=new DataView(b);d.setUint32(0,0x46546c67,true);d.setUint32(4,2,true);d.setUint32(8,length,true);return b}
function harness(){
  let now=0,next=0;const timers=new Map(),requests=[],parses=[],phases=[];
  const status={set textContent(v){phases.push(v)}};
  class XHR{
    constructor(){requests.push(this)}
    open(method,url){this.url=url}
    send(){}
    abort(){this.aborted=true;this.onabort?.()}
    progress(loaded=1,total=100){this.onprogress?.({loaded,total,lengthComputable:true})}
    complete(body=glb(),status=200){this.response=body;this.status=status;this.onload?.()}
  }
  const decoder={};
  class Loader{setMeshoptDecoder(d){assert.equal(d,decoder)}parse(buffer,path,ok,fail){parses.push({buffer,ok,fail})}}
  const ctx=vm.createContext({window:{THREE:{GLTFLoader:Loader},MeshoptDecoder:decoder},THREE:{GLTFLoader:Loader},MeshoptDecoder:decoder,XMLHttpRequest:XHR,ArrayBuffer,DataView,Date,$:()=>status,setTimeout:(fn,ms)=>{timers.set(++next,{fn,time:now+ms});return next},clearTimeout:id=>timers.delete(id)});
  vm.runInContext(source,ctx);
  const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve()};
  return {requests,parses,phases,timers,load:()=>vm.runInContext('loadGLB()',ctx),cached:()=>vm.runInContext('glbPromise',ctx),flush,
    async tick(ms){const end=now+ms;while(true){const entry=[...timers].filter(([,v])=>v.time<=end).sort((a,b)=>a[1].time-b[1].time)[0];if(!entry)break;now=entry[1].time;timers.delete(entry[0]);entry[1].fn();await flush()}now=end;await flush()}};
}
test('1% stall aborts, retries once, and preserves single flight',async()=>{
 const h=harness(),p=h.load();assert.equal(h.load(),p);h.requests[0].progress();await h.tick(10000);
 assert.equal(h.requests[0].aborted,true);assert.equal(h.requests.length,2);assert.match(h.requests[1].url,/&r=/);
 h.requests[1].complete();await h.flush();h.parses[0].ok({scene:'scene'});assert.equal(await p,'scene');assert.equal(h.timers.size,0);
});
test('both stalls reject within bound and allow manual retry',async()=>{
 const h=harness(),p=h.load(),rejected=assert.rejects(p,/stalled/);await h.tick(20000);await rejected;
 assert.equal(h.requests.length,2);assert.equal(h.cached(),null);const next=h.load();assert.notEqual(next,p);assert.equal(h.requests.length,3);
 h.requests[2].complete();await h.flush();h.parses[0].ok({scene:'recovered'});await next;
});
for(const [name,body,status] of [['403',glb(),403],['HTML',new TextEncoder().encode('<html>challenge</html>').buffer,200],['truncated',glb().slice(0,11),200],['wrong declared length',(()=>{const b=glb();new DataView(b).setUint32(8,99,true);return b})(),200]]){
 test(`${name} response retries then rejects malformed response`,async()=>{
  const h=harness(),p=h.load(),rejected=assert.rejects(p);h.requests[0].complete(body,status);await h.flush();assert.equal(h.requests.length,2);
  h.requests[1].complete(body,status);await rejected;assert.equal(h.parses.length,0);assert.equal(h.cached(),null);assert.equal(h.timers.size,0);
 });
}
test('parse deadline has no transport retry and late callbacks cannot replace fresh load',async()=>{
 const h=harness(),p=h.load(),rejected=assert.rejects(p,/preparation timed out/);h.requests[0].complete();await h.flush();await h.tick(15000);await rejected;
 assert.equal(h.requests.length,1);const fresh=h.load();h.requests[1].complete();await h.flush();h.parses[0].ok({scene:'stale'});h.parses[0].fail(new Error('late'));assert.equal(h.cached(),fresh);
 h.parses[1].ok({scene:'fresh'});assert.equal(await fresh,'fresh');assert.equal(h.timers.size,0);
});
test('late aborted request events are ignored, normal parsing has a distinct phase',async()=>{
 const h=harness(),p=h.load(),old=h.requests[0],progress=old.onprogress,onload=old.onload;old.progress();await h.tick(10000);
 const phase=h.phases.at(-1);progress({loaded:99,total:100,lengthComputable:true});old.response=glb();old.status=200;onload();assert.equal(h.phases.at(-1),phase);
 h.requests[1].progress(100);assert.match(h.phases.at(-1),/99%/);h.requests[1].complete();await h.flush();assert.equal(h.phases.at(-1),'Preparing your 3D vibe…');assert.equal(h.parses.length,1);
 h.parses[0].ok({scene:'ok'});assert.equal(await p,'ok');assert.equal(h.timers.size,0);
});
test('ongoing progress cannot bypass overall download deadline',async()=>{
 const h=harness(),p=h.load();for(let i=1;i<=3;i++){await h.tick(9000);h.requests[0].progress(i)}await h.tick(3000);assert.equal(h.requests[0].aborted,true);assert.equal(h.requests.length,2);
 h.requests[1].complete();await h.flush();h.parses[0].ok({scene:'ok'});await p;
});
test('decoder failure does not retry download',async()=>{
 const h=harness(),p=h.load(),rejected=assert.rejects(p,/decode/);h.requests[0].complete();await h.flush();h.parses[0].fail(new Error('decode'));await rejected;assert.equal(h.requests.length,1);assert.equal(h.cached(),null);assert.equal(h.timers.size,0);
});
for(const [message,label] of [['download stalled','Connection stalled'],['avatar download timed out','Connection stalled'],['avatar preparation timed out','Couldn’t prepare your vibe'],['avatar HTTP 403','Server couldn’t send your vibe'],['invalid or incomplete avatar body','Server couldn’t send your vibe'],['<script>untrusted</script>','Failed to load']]){
 test(`retry UI safely identifies ${message} and restarts last build`,()=>{
  const button={},removed=[],builds=[],personas=[{a:[1]}],loader={classList:{remove:c=>removed.push(c)}};
  const ctx=vm.createContext({$:selector=>selector==='#vibeLoader'?loader:button,buildVibe:p=>builds.push(p),personas});
  const retrySource=html.slice(html.indexOf('function showRetry('),html.indexOf('// personas:'));
  vm.runInContext('let retryCount=0,glbPromise=Promise.resolve(),lastPersonas=personas;'+retrySource,ctx);
  ctx.error=new Error(message);vm.runInContext('showRetry(error)',ctx);
  assert.equal(button.textContent,`⚠️ ${label} • Tap to retry 🔄`);assert.deepEqual(removed,['done']);assert.match(loader.innerHTML,/id="retryBtn" type="button"/);assert.ok(!loader.innerHTML.includes(message));
  let stopped=false;button.onclick({stopPropagation(){stopped=true}});assert.ok(stopped);assert.equal(vm.runInContext('glbPromise',ctx),null);assert.equal(vm.runInContext('retryCount',ctx),1);assert.equal(builds[0],personas);assert.match(loader.innerHTML,/id="vibeStatus"/);
 });
}
