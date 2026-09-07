const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8'),VibeChain=require('../vibe-chain.js'),PreferenceQuiz=require('../preference-quiz.js');
const part=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
function harness(hash=''){
 const nodes=new Map(),timers=[];function node(){return {hidden:false,disabled:false,children:[],style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},textContent:'',value:'',appendChild(n){n.parentNode=this;this.children.push(n)},replaceChildren(){this.children=[]},prepend(){},after(){},setAttribute(){},querySelector(){return this.span??=node()},focus(){},lastElementChild:{click(){}}}}
 const $=s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)};
 const adapter={...PreferenceQuiz},ctx=vm.createContext({VibeChain,PreferenceQuiz:adapter,$,document:{querySelector:$,createElement:node},location:{hash,origin:'https://example.test',pathname:'/'},history:{replaceState(){}},navigator:{},setTimeout:fn=>timers.push(fn),requestAnimationFrame(){},performance:{now:()=>0},show(){},confetti(){},buildVibe(p){ctx.built=p}});
 vm.runInContext(part('// axes:','$("#gender").onclick')+part('// ---- group from URL ----','// floating emoji bg')+part('function shuffledQuestions(', '// ---- scoring ----')+part('function score(a){','// ---- share ----')+part('function shareLink(){','$("#share").onclick')+part('function seed(str){','const AVATARS=')+part('const pool=g=>','// which attributes'),ctx);
 return {ctx,$,adapter,run:s=>vm.runInContext(s,ctx),flush(){while(timers.length)timers.shift()()}};
}
function complete(h){h.run('startQuiz()');for(let i=0;i<12;i++){const button=h.$('#opts').children[i%4];button.onclick();h.flush()}}
function allText(n){return [n.textContent,...n.children.map(allText)].join(' ')}
test('fresh edition asks 12 bank questions by option ID and shows independent snapshot bands',()=>{
 const h=harness();assert.equal(h.run('edition'),'preferences');assert.equal(h.$('#s-intro .sub').textContent,'12 picks from 80 questions. No right answers. Find your vibe, then meet your crew.');h.$('#name').value='<b>Sam</b>';complete(h);
 const group=h.run('completedGroup()');assert.equal(group.length,1);assert.equal(group[0].q.length,12);assert.equal(h.run('state.responses.length'),12);assert.equal(h.$('#arche').textContent,'Your vibe snapshot');assert.equal(h.$('#stats').children.length,4);assert.equal(h.$('#trivia').textContent,'Early quiz edition · still being tested.');assert.equal(h.$('#youlabel').textContent,"<b>Sam</b>'s preferences");assert.equal(h.$('#remix').hidden,false);
 assert.match(h.run('shareLink()'),/#v=3&c=/);assert.equal(PreferenceQuiz.read(h.run('shareLink()').split('https://example.test/')[1]).members.length,1);assert.equal(h.ctx.built.length,1);
});
test('question context stays neutral, swapping changes unanswered item and records no answer',()=>{
 const h=harness();h.run('startQuiz()');assert.doesNotMatch(h.$('#tag').textContent,/_/);assert.equal(h.$('#swapQuestion').hidden,false);assert.equal(h.$('#questionInstruction').hidden,false);
 const before=h.run('PreferenceQuiz.question(state.session,state.i).id');h.$('#swapQuestion').onclick();assert.equal(h.run('state.responses.length'),0);
 const after=h.run('PreferenceQuiz.question(state.session,state.i).id');assert.notEqual(before,after);
 h.adapter.swap=()=>{throw Error('untrusted failure')};h.$('#swapQuestion').onclick();assert.equal(h.$('#questionNotice').hidden,false);assert.equal(h.$('#questionNotice').textContent,'No more swaps for this spot. You can answer if one fits, or leave the quiz unfinished.');assert.equal(h.run('state.responses.length'),0);
});
test('generation failure exposes retry instead of entering an empty session',()=>{
 const h=harness();h.adapter.createSession=()=>{throw Error('failed')};h.run('startQuiz()');assert.equal(h.$('#linkNotice').hidden,false);assert.match(h.$('#start').textContent,/try again/);assert.equal(h.$('#opts').children.length,0);
 h.adapter.createSession=PreferenceQuiz.createSession;h.run('startQuiz()');assert.equal(h.$('#opts').children.length,4);
});
test('pair uses descriptions and group uses independent distributions for every person',()=>{
 const h=harness();complete(h);h.run('passPhone()');complete(h);assert.equal(h.$('#pairring').hidden,true);assert.equal(h.$('#energy').children.length,4);assert.match(h.$('#duo').textContent,/not a friendship prediction/);assert.doesNotMatch(allText(h.$('#energy')),/%/);
 h.run('passPhone()');complete(h);assert.equal(h.$('#vsTitle').textContent,'Group dynamics');assert.match(h.$('#duo').textContent,/3 people/);assert.equal(h.$('#energy').children.length,4);assert.equal(h.$('#closest').textContent,'');assert.equal(h.$('#roster').children.length,3);assert.match(allText(h.$('#roster')),/Vibe snapshot/);
});
test('remix alters cosmetics only while shared history and preference profile remain stable',()=>{
 const h=harness();complete(h);h.run('passPhone()');complete(h);
 const before=JSON.stringify(h.run('incomingMembers')),profile=JSON.stringify(h.run('PreferenceQuiz.profile(completedGroup()[1])')),answers=JSON.stringify(h.run('state.responses'));
 h.adapter.newStyle=()=>Array(12).fill(3);h.$('#remix').onclick();assert.equal(JSON.stringify(h.run('incomingMembers')),before);assert.equal(JSON.stringify(h.run('state.responses')),answers);assert.equal(JSON.stringify(h.run('PreferenceQuiz.profile(completedGroup()[1])')),profile);assert.deepEqual(Array.from(h.run('completedGroup()[1].a')),Array(12).fill(3));
});
test('legacy links retain original questions and scoring until explicit edition reset',()=>{
 const h=harness(VibeChain.write([{a:Array(12).fill(0),name:'Old friend',g:'x'}]));assert.equal(h.run('edition'),'legacy');assert.equal(h.$('#newEdition').hidden,false);h.run('startQuiz()');assert.equal(h.$('#swapQuestion').hidden,true);assert.equal(h.$('#questionInstruction').hidden,true);assert.match(h.$('#s-intro .sub').textContent,/actually match/);assert.equal(h.run('state.order.length'),12);assert.equal(h.run('incomingMembers.length'),1);
 h.$('#newEdition').onclick();assert.equal(h.run('edition'),'preferences');assert.equal(h.run('incomingMembers.length'),0);assert.equal(h.$('#newEdition').hidden,true);
});
