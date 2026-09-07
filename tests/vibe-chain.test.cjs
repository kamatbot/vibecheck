const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Chain=require('../vibe-chain.js');
const person=(name='Maya',g='x',answer=0)=>({name,g,a:Array(12).fill(answer)});
const payload=data=>'#v=2&c='+Buffer.from(JSON.stringify(data)).toString('base64url');

test('each hop retains the full ordered history; sharing/replay do not mutate it',()=>{
 let incoming=[];
 for(let i=0;i<8;i++){
  const p=person('Player '+(i+1),['m','f','x'][i%3],i%4),before=JSON.stringify(incoming);
  const completed=Chain.append(incoming,p),link=Chain.write(completed);
  assert.equal(JSON.stringify(incoming),before);
  assert.equal(Chain.write(Chain.append(incoming,p)),link);
  incoming=Chain.read(link).members;
  assert.equal(incoming.length,i+1);
  assert.equal(incoming[0].name,'Player 1');
 }
 assert.deepEqual(incoming.map(p=>p.name),Array.from({length:8},(_,i)=>'Player '+(i+1)));
});
test('Unicode and markup names round-trip as data',()=>{
 const people=[person('🧋Zoë & 李'),person('<img src=x>','f'),person('🎮'.repeat(14),'m')];
 const result=Chain.read(Chain.write(people));
 assert.equal(result.error,null);assert.deepEqual(result.members,people);
});
test('legacy links retain known friend, answer order, name and gender',()=>{
 const read=Chain.read('#a=012301230123&n=Maya%20%26%20Lee&h=9&g=f');
 assert.equal(read.legacyHops,9);assert.equal(read.members.length,1);
 assert.deepEqual(read.members[0],{name:'Maya & Lee',g:'f',a:[0,1,2,3,0,1,2,3,0,1,2,3]});
 assert.equal(Chain.read(Chain.write(read.members)).members.length,1);
 assert.equal(Chain.read('#a=000000000000&h=-1').legacyHops,0);
});
test('empty and unrelated fragments permit a solo quiz',()=>{
 assert.deepEqual(Chain.read(''),{members:[],error:null,legacyHops:0});
 assert.deepEqual(Chain.read('#section'),{members:[],error:null,legacyHops:0});
});
test('64 members survive without truncation; adding person65 fails explicitly',()=>{
 const people=Array.from({length:64},(_,i)=>person('🎮'.repeat(14),i%2?'f':'m',i%4));
 const hash=Chain.write(people);assert.ok(hash.length<Chain.MAX_HASH);
 assert.deepEqual(Chain.read(hash).members,people);
 assert.throws(()=>Chain.append(people,person()),/full/);
 assert.throws(()=>Chain.write([...people,person()]),/full/);
 assert.deepEqual(Chain.read(payload(Array.from({length:65},()=>['000000000000','M','x']))).members,[]);
});
test('malformed, unknown-version, duplicate, oversized and invalid UTF8 payloads fail closed',()=>{
 const broken=['#v=3&c=abcd','#v=2&v=2&c=abcd','#v=2&c=abcd&c=abcd','#v=2&c=!', '#v=2&c=wA', '#v=2&c='+('a'.repeat(Chain.MAX_HASH)),payload({}),payload([]),'#a=00000000000x','#a=00000000000%20','#a=000000000000&a=111111111111'];
 for(const hash of broken){const result=Chain.read(hash);assert.ok(result.error,hash.slice(0,40));assert.deepEqual(result.members,[])}
});
test('invalid member fields reject the entire group, never silently omit a participant',()=>{
 const bad=[['00000000000','M','x'],['000000000004','M','x'],[123,'M','x'],['000000000000','M','z'],['000000000000',{},'x'],['000000000000','x'.repeat(15),'x'],['000000000000','M','x','extra']];
 for(const row of bad){const result=Chain.read(payload([['000000000000','valid','f'],row]));assert.ok(result.error);assert.deepEqual(result.members,[])}
 assert.throws(()=>Chain.append([],person('x'.repeat(15))));
 assert.throws(()=>Chain.write([]));
 const p=person();p.a[0]=NaN;assert.throws(()=>Chain.write([p]));
});
// Exercise the unchanged quiz scoring, not a duplicate formula.
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const constants=html.slice(html.indexOf('const Q='),html.indexOf('const $='));
const scoring=html.slice(html.indexOf('function score('),html.indexOf('function duo('));
const {Q,score,match}=vm.runInNewContext(constants+'\n'+scoring+'\n({Q,score,match})');
test('group energy conserves100%, unanimous preferences exclude trivia, closest ties are stable',()=>{
 const p=person(),d=Chain.dynamics([p,p,p],Q,score,match);
 assert.equal(d.energy.reduce((a,b)=>a+b,0),100);
 assert.ok(d.energy.every(x=>Number.isInteger(x)&&x>=0&&x<=100));
 assert.deepEqual(Array.from(d.shared),[0,1,2,3,4,6,7,9,11]);
 assert.deepEqual(d.closest,{left:0,right:1,percent:99});
 assert.equal(d.leadAxis,3);
});
test('group metrics include every participant and no shared picks are invented',()=>{
 const people=[person('A','x',0),person('B','x',0),person('C','x',3),person('D','x',2)];
 const d=Chain.dynamics(people,Q,score,match);
 assert.deepEqual(Array.from(d.shared),[]);assert.deepEqual(d.closest,{left:0,right:1,percent:99});
 assert.equal(d.energy.reduce((a,b)=>a+b,0),100);
 assert.notDeepEqual(d.energy,Chain.dynamics(people.slice(0,3),Q,score,match).energy);
 assert.throws(()=>Chain.dynamics(people.slice(0,2),Q,score,match),/three/);
});
test('append returns independent answer arrays',()=>{
 const incoming=[person('A')],current=person('B');const completed=Chain.append(incoming,current);
 completed[0].a[0]=3;completed[1].a[1]=2;
 assert.equal(incoming[0].a[0],0);assert.equal(current.a[1],0);
});
