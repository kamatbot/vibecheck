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
test('fresh and invalid links use the original 12-question emoji quiz and V2 sharing',()=>{
 for(const hash of ['', '#v=3&c=broken']){
  const h=harness(hash);assert.equal(h.run('edition'),'legacy');assert.equal(h.$('#newEdition').hidden,true);h.run('startQuiz()');assert.equal(h.$('#opts').className,'opts');assert.match(h.$('#opts').children[0].innerHTML,/<em>.*<\/em><span>/);assert.equal(h.run('state.order.length'),12);
  h.run('state.a=Array(12).fill(0)');assert.match(h.run('shareLink()'),/#v=2&c=/);
 }
 assert.doesNotMatch(html,/id="swapQuestion"|id="questionInstruction"|id="remix"|PreferenceQuiz\.createSession|PreferenceQuiz\.swap|PreferenceQuiz\.member/);
});
function savedGroup(count){
 const session=PreferenceQuiz.createSession('A',[]),responses=Array.from({length:12},(_,i)=>{const q=PreferenceQuiz.question(session,i);return {question_id:q.id,question_version:1,option_id:q.options[i%4].id}});
 const person=PreferenceQuiz.member(session,responses,'<b>Saved</b>','x',Array(12).fill(0));
 return Array.from({length:count},(_,i)=>({...person,name:i?`Saved ${i+1}`:person.name,a:person.a.slice(),q:person.q.slice(),r:person.r.slice()}));
}
for(const count of [1,2,9,64])test(`V3 saved ${count}-person group is read-only and preserves all profiles`,()=>{
 const group=savedGroup(count),hash=PreferenceQuiz.write(group,'A'),h=harness(hash),before=JSON.stringify(h.run('incomingMembers'));
 assert.equal(h.run('edition'),'preferences');assert.equal(h.$('#s-intro .sub').textContent,'This group used an earlier quiz. View the saved group, or start a classic quiz.');assert.equal(h.$('#start').hidden,true);assert.equal(h.$('#start').disabled,true);assert.equal(h.$('#viewChain').hidden,false);assert.equal(h.$('#newEdition').hidden,false);
 h.run('startQuiz();passPhone()');assert.equal(h.run('state.a.length'),0);assert.equal(JSON.stringify(h.run('incomingMembers')),before);
 h.$('#viewChain').onclick();assert.equal(h.$('#card').hidden,count!==1);assert.equal(h.$('#share').textContent,'Share saved group 📲');assert.equal(h.$('#s-result>.foot').textContent,'This saved group stays as it was. Start a classic quiz to make a new chain.');assert.equal(h.$('#pass').hidden,true);assert.equal(h.$('#newChain').hidden,false);assert.equal(h.$('#fullNotice').hidden,count!==64);assert.equal(h.$('#pairring').hidden,true);assert.equal(h.ctx.built.length,Math.min(8,count));assert.equal(h.$('#roster').children.length,count);
 if(count===1){assert.equal(h.$('#arche').textContent,'Your vibe snapshot');assert.equal(h.$('#stats').children.length,4);assert.equal(h.$('#youlabel').textContent,"<b>Saved</b>'s saved preferences")}
 if(count===2){assert.equal(h.$('#energy').children.length,4);assert.match(h.$('#duo').textContent,/not a friendship prediction/)}
 if(count>=3){assert.equal(h.$('#energy').children.length,4);assert.match(h.$('#duo').textContent,new RegExp(`${count} people`))}
 assert.equal(h.run('shareLink()'),'https://example.test/'+hash);assert.equal(JSON.stringify(h.run('incomingMembers')),before);assert.equal(JSON.stringify(h.run('completedGroup()')),JSON.stringify(group));
 h.run('completedGroup()[0].q[0]=79');assert.equal(JSON.stringify(h.run('incomingMembers')),before);
});
test('explicit Start a classic quiz clears V3 history and restores joining without scale mixing',()=>{
 const h=harness(PreferenceQuiz.write(savedGroup(2),'A'));h.$('#newEdition').onclick();assert.equal(h.run('edition'),'legacy');assert.equal(h.run('incomingMembers.length'),0);assert.equal(h.$('#start').hidden,false);assert.equal(h.$('#name').hidden,false);assert.equal(h.$('#newEdition').hidden,true);assert.equal(h.$('#viewChain').hidden,true);h.run('startQuiz()');assert.equal(h.run('state.order.length'),12);assert.equal(h.$('#opts').className,'opts');h.run('state.a=Array(12).fill(0);renderGroup(completedGroup())');assert.equal(h.$('#share').textContent,'Send to a friend 📲');assert.match(h.$('#s-result>.foot').textContent,/Every friend stays in the group/);
});
