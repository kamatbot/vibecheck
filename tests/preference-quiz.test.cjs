const {test}=require('node:test'),assert=require('node:assert/strict');
const Quiz=require('../preference-quiz.js'),{bank}=require('../preferences/data-v1.js');
const Legacy=require('../vibe-chain.js');
const complete=(session,name='Maya',level=0)=>Quiz.member(session,session.items.map(row=>({question_id:row.question_id,question_version:1,option_id:'abcd'[level]})),name,'x',Array(12).fill(2));
const fixture=()=>complete(Quiz.createSession('A'));
const payload=data=>'#v=3&c='+Buffer.from(JSON.stringify(data)).toString('base64url');
test('new quizzes and legacy shared links remain separate editions',()=>{
 assert.equal(Quiz.read('').edition,'preferences');
 const p={name:'Original',g:'f',a:Array(12).fill(1)},old=Quiz.read(Legacy.write([p]));
 assert.equal(old.edition,'legacy');assert.deepEqual(old.members,[p]);
 assert.equal(Quiz.read('#a=012301230123').edition,'legacy');
 assert.ok(Quiz.read('#v=4&c=abc').error);
});
test('V3 preserves exact question and option identities, order, cosmetics and Unicode',()=>{
 const s=Quiz.createSession('B'),p=complete(s,'🧋Zoë & 李');
 const read=Quiz.read(Quiz.write([p],'B'));
 assert.equal(read.error,null);assert.equal(read.panel,'B');assert.deepEqual(read.members,[p]);
 assert.deepEqual(Quiz.profile(read.members[0]),Quiz.profile(p));
 assert.deepEqual(p.q.map(i=>bank[i].id),s.items.map(q=>q.question_id));
});
test('64 maximum-length names fit the fragment limit and all affect group counts',()=>{
 const p=fixture();p.name='🎮'.repeat(14);
 const people=Array.from({length:64},()=>p),hash=Quiz.write(people,'C');
 assert.ok(hash.length<Quiz.MAX_HASH,hash.length);
 const read=Quiz.read(hash);assert.equal(read.error,null);assert.equal(read.members.length,64);
 for(const axis of Quiz.group(read.members).axes)assert.equal(axis.counts.low+axis.counts.middle+axis.counts.high,64);
 assert.throws(()=>Quiz.append(people,p),/full/);assert.throws(()=>Quiz.createSession('A',people),/full/);
});
test('malformed/unknown/truncated versions fail without silently removing participants',()=>{
 const p=fixture(),good=Quiz.write([p],'A'),data=JSON.parse(Buffer.from(good.split('c=')[1],'base64url'));
 const broken=[good+'&v=3',good+'&c=abc','#v=3&c=wA','#v=3&c='+('a'.repeat(Quiz.MAX_HASH)),payload([2,'A',data[2]]),payload([1,'Z',data[2]]),payload([1,'A',[]])];
 for(const bad of broken){const result=Quiz.read(bad);assert.ok(result.error);assert.deepEqual(result.members,[])}
 for(const mutate of [r=>r[2]='__'.repeat(12),r=>r[2]='AA'.repeat(12),r=>r[3]='22222222222x',r=>r[4]=2,r=>r[0]='x'.repeat(15),r=>r[1]='z']){
  const copy=structuredClone(data);mutate(copy[2][0]);assert.ok(Quiz.read(payload(copy)).error);
 }
});
test('untrusted dimensions/options and incomplete answers never become results',()=>{
 const session=Quiz.createSession('A');assert.throws(()=>Quiz.member(session,[],'M','x',Array(12).fill(0)),/Finish/);
 const p=complete(session);p.r[0]='e';assert.throws(()=>Quiz.profile(p));
 p.r[0]='a';p.q[0]=p.q[1];assert.throws(()=>Quiz.profile(p),/blueprint/);
 const sparse=fixture();delete sparse.a[1];assert.throws(()=>Quiz.write([sparse],'A'),/style/);
});
test('style remix and answer display order cannot change preference scores',()=>{
 const session=Quiz.createSession('A'),p=complete(session,'M',2),before=Quiz.profile(p);
 p.a=Quiz.newStyle();p.o=p.o?0:1;
 assert.deepEqual(Quiz.profile(p),before);
 const q=Quiz.question(session,0);assert.deepEqual(q.options.map(x=>x.id),session.items[0].display_option_ids);
 const copy=Quiz.append([],p);copy[0].q[0]=(p.q[0]+1)%80;assert.notEqual(copy[0].q[0],p.q[0]);
});
test('different forms score by identities and meaningful zeroes remain zero',()=>{
 const A=complete(Quiz.createSession('A'),'A',0),B=complete(Quiz.createSession('B'),'B',3);
 assert.ok(Quiz.profile(A).axes.every(x=>x.value===0));assert.ok(Quiz.profile(B).axes.every(x=>x.value===1));
 assert.equal(Quiz.compare(A,B).score,0);assert.equal(Quiz.compare(B,A).score,0);assert.equal(Quiz.compare(A,A).score,100);
 assert.ok(Quiz.compare(A,B).axes.every(x=>x.left!==x.right));
 const C=complete(Quiz.createSession('C'),'C',0),group=Quiz.group([A,B,C]);
 assert.ok(group.axes.every(x=>x.counts.low===2&&x.counts.high===1));
});
test('multi-hop links preserve earlier people while selecting varied later forms',()=>{
 let people=[];
 for(let i=0;i<9;i++){
  const session=Quiz.createSession('A',people),p=complete(session,'Person'+i,i%4);
  const before=JSON.stringify(people);const next=Quiz.append(people,p);assert.equal(JSON.stringify(people),before);
  people=Quiz.read(Quiz.write(next,'A')).members;
 }
 assert.equal(people.length,9);assert.equal(people[0].name,'Person0');
 assert.equal(new Set(people.map(p=>p.q.slice().sort((a,b)=>a-b).join(','))).size,9);
});
test('swapped items retain final identities through a share roundtrip',()=>{
 const session=Quiz.createSession('A'),swapped=Quiz.swap(session,0,[]);
 assert.notEqual(swapped.items[0].question_id,session.items[0].question_id);
 const p=complete(swapped),read=Quiz.read(Quiz.write([p],'A'));
 assert.equal(bank[read.members[0].q[0]].id,swapped.items[0].question_id);
 assert.deepEqual(Quiz.profile(p),Quiz.profile(read.members[0]));
});
