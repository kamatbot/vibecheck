const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8'),VibeChain=require('../vibe-chain.js');
const part=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
function harness(){
 const nodes=new Map();function node(){return {hidden:false,disabled:false,children:[],style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},textContent:'',value:'',appendChild(n){this.children.push(n)},replaceChildren(){this.children=[]},prepend(){},after(){},querySelector(){return this.span??=node()},focus(){},lastElementChild:{click(){}}}}
 const $=s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)};
 const ctx=vm.createContext({VibeChain,PreferenceQuiz:{read:hash=>({...VibeChain.read(hash),edition:"legacy",panel:"A"}),newPanel:()=>"A"},$,document:{querySelector:$,createElement:node},location:{hash:'',origin:'https://example.test',pathname:'/'},history:{replaceState(){}},setTimeout(){},requestAnimationFrame(){},performance:{now:()=>0},show(){},renderQ(){},buildVibe(p){ctx.built=p}});
 vm.runInContext(part('// axes:','$("#gender").onclick')+part('// ---- group from URL ----','// floating emoji bg')+part('function passPhone(){','function renderQ')+part('function score(a){','function finish(){')+part('let pairAnimation=','// ---- share ----')+part('function shareLink(){','$("#share").onclick')+part('function seed(str){','const AVATARS=')+part('const pool=g=>','// which attributes'),ctx);
 return {ctx,$,run:s=>vm.runInContext(s,ctx)};
}
const p={a:Array(12).fill(0),name:'<b>hi</b>',g:'x'};
test('repeat sharing never mutates incoming; phone pass adds once',()=>{
 const h=harness();h.ctx.p=p;h.run('incomingMembers=[p];state.a=p.a.slice();state.name="Next"');
 const first=h.run('shareLink()');assert.equal(h.run('shareLink()'),first);assert.equal(h.run('incomingMembers.length'),1);
 h.run('state.a=Array(12).fill(1)');assert.equal(h.run('completedGroup().length'),2);
 h.run('passPhone()');assert.equal(h.run('incomingMembers.length'),2);assert.equal(h.run('state.a.length'),0);
 h.run('state.a=p.a.slice();state.name="Third"');assert.equal(h.run('completedGroup().length'),3);
});
test('three people renders group metrics, safe arrival roster; pair and solo reset state',()=>{
 const h=harness();h.ctx.p=p;h.run('renderGroup([p,p,p])');assert.equal(h.$('#vsTitle').textContent,'Group dynamics');assert.equal(h.$('#pairring').hidden,true);assert.equal(h.$('#roster').children[0].textContent,'1. <b>hi</b>');assert.equal(h.$('#roster').children.length,3);assert.equal(h.ctx.built.length,3);
 h.run('renderGroup([p,p])');assert.equal(h.$('#pairring').hidden,false);assert.equal(h.$('#groupDetails').hidden,true);
 h.run('renderGroup([p])');assert.equal(h.$('#vs').hidden,true);assert.equal(h.$('#castInfo').hidden,true);
});
test('first eight remain stable as groups grow; everyone shapes metrics and roster',()=>{
 const h=harness();h.ctx.p=p;const old=Array.from(h.run('assignBases(Array(9).fill(p))'));assert.equal(new Set(old.slice(0,8)).size,8);assert.deepEqual(Array.from(h.run('assignBases(Array(64).fill(p))')).slice(0,9),old);
 h.run('renderGroup(Array(9).fill(p))');assert.equal(h.ctx.built.length,8);assert.deepEqual(Array.from(h.ctx.built,p=>p.idx),old.slice(0,8));assert.equal(h.$('#castLimit').textContent,'First 8 vibes shown · All 9 people shape the dynamics.');assert.equal(h.$('#roster').children.length,9);
 h.run('renderGroup(Array(64).fill(p))');assert.equal(h.ctx.built.length,8);assert.deepEqual(Array.from(h.ctx.built,p=>p.idx),old.slice(0,8));assert.equal(h.$('#duo').textContent,'64 people · Social leads the crew');assert.equal(h.$('#roster').children.length,64);assert.doesNotMatch(html,/castPage|castPrev|castNext|castNav/);
});
test('responsive cast columns keep desktop rows readable and relayout on resize',()=>{const h=harness();assert.equal(h.run('castColumns(4,650)'),4);assert.equal(h.run('castColumns(4,320)'),2);assert.equal(h.run('castColumns(8,650)'),4);assert.equal(h.run('castColumns(5,650)'),3);assert.match(html,/V\.layout\(\);V\.fit\(\)/)});
test('full chain retains every member and only explicit new chain clears history',()=>{
 const h=harness();h.ctx.p=p;h.run('incomingMembers=Array(64).fill(p);viewingFull=true;renderGroup(incomingMembers)');assert.equal(h.$('#pass').disabled,true);assert.equal(h.$('#fullNotice').hidden,false);assert.equal(h.$('#roster').children.length,64);assert.equal(VibeChain.read(h.run('shareLink()').split('https://example.test/')[1]).members.length,64);h.run('passPhone()');assert.equal(h.run('incomingMembers.length'),64);h.run('newChain()');assert.equal(h.run('incomingMembers.length'),0);
});
test('answers suppress double tap zoom without disabling pinch or native scroll',()=>{assert.match(html,/\.opts\{touch-action:manipulation/);assert.match(html,/\.opt\{touch-action:manipulation/);assert.doesNotMatch(html,/user-scalable\s*=\s*no|maximum-scale\s*=\s*1|preventDefault\(/)});

test('Fisher-Yates produces complete independent question permutations',()=>{
 const h=harness();h.runSource=source=>vm.runInContext(source,h.ctx);h.runSource(part('function shuffledQuestions(', '// Advance the chain'));
 const left=Array.from(h.run('shuffledQuestions(()=>0)')),right=Array.from(h.run('shuffledQuestions(()=>.999)'));
 assert.notDeepEqual(left,right);for(const order of [left,right])assert.deepEqual([...order].sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i));
});
test('shuffled clicks reconstruct canonical answers, scores and links; each start reshuffles',()=>{
 const h=harness(),timers=[];h.ctx.setTimeout=fn=>timers.push(fn);h.ctx.navigator={};h.ctx.finish=()=>{};
 vm.runInContext(part('function shuffledQuestions(', '// Advance the chain')+part('function renderQ(){','// ---- scoring ----'),h.ctx);
 h.run('Math.random=()=>0;startQuiz()');const first=Array.from(h.run('state.order'));
 const canonical=Array.from({length:12},(_,i)=>i%4);h.ctx.canonical=canonical;
 for(let i=0;i<12;i++){
   const index=h.run('state.order[state.i]');assert.equal(h.$('#qtext').textContent,h.run(`Q[${index}].q`));
   const button={classList:{add(){}},parentNode:{children:[]}};h.ctx.button=button;
   h.run(`pick(${canonical[index]},button)`);while(timers.length)timers.shift()();
 }
 assert.deepEqual(Array.from(h.run('state.a')),canonical);assert.equal(JSON.stringify(h.run('score(state.a)')),JSON.stringify(h.run('score(canonical)')));
 assert.deepEqual(VibeChain.read(h.run('shareLink()').split('https://example.test/')[1]).members[0].a,canonical);
 h.run('passPhone();Math.random=()=>.999;startQuiz()');assert.notDeepEqual(Array.from(h.run('state.order')),first);assert.equal(h.run('incomingMembers.length'),1);
});
test('intro reuses one canvas with four preview identities and lifecycle guards',()=>{
 const h=harness();vm.runInContext(part('function showIntroPreview(){','function buildVibe(personas){'),h.ctx);h.run('showIntroPreview()');assert.deepEqual(Array.from(h.ctx.built,p=>p.idx),[0,2,5,7]);assert.equal(h.$('#introPreview').children.length,1);
 assert.equal((html.match(/id="vibe"/g)||[]).length,1);assert.equal((html.match(/new THREE.WebGLRenderer/g)||[]).length,1);assert.doesNotMatch(html,/id="again"|#again|Run it back/);
 assert.match(html,/if\(id==="#s-intro"\)showIntroPreview\(\);else if\(id==="#s-quiz"\)buildId\+\+/);
 assert.match(html,/if\(id!==buildId\)return/);assert.match(html,/if\(!V\|\|!avatarScreenVisible\(\)\)/);assert.match(html,/showIntroPreview\(\);\s*<\/script>/);
});
