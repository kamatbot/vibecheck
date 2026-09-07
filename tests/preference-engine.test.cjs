const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {createHash} = require('node:crypto');
const {bank, manifest} = require('../preferences/data-v1.js');
const {DIMENSIONS, validateBank, panelForChain, assembleSession, swapUnansweredItem, band, scoreSession, compareProfiles, summarizeGroup} = require('../preferences/engine-v1.js');
const answers=(s,id='b')=>s.items.map(q=>({question_id:q.question_id,question_version:q.question_version,option_id:id}));
const make=(i=0,extra={})=>assembleSession(bank,manifest,{chainId:'demo',sessionId:`s${i}`,participantId:`p${i}`,...extra});
const s=make(), b=scoreSession(bank,manifest,s,answers(s));

test('80 items, four options, 20 per axis, 7/7/6 per facet, target-only weights',()=>assert.equal(validateBank(bank,manifest),true));
test('manifest pins exact bank bytes',()=>assert.equal(createHash('sha256').update(JSON.stringify(bank,null,2)+'\n').digest('hex'),manifest.item_file_sha256));
test('same input creates the same form and presentation',()=>assert.deepEqual(make(),s));
test('anchor panel deterministic within chain',()=>assert.equal(panelForChain('demo',manifest),s.anchor_panel));
test('zero is valid, not missing',()=>{
 const z=scoreSession(bank,manifest,s,answers(s,'a')); assert.equal(z.status,'provisional_snapshot');
 DIMENSIONS.forEach(d=>assert.equal(z.axes[d].value,0)); assert.equal(compareProfiles(z,z,manifest).display_score,100);
});
test('all upper choices reach one on every axis; no forced total',()=>{
 const p=scoreSession(bank,manifest,s,answers(s,'d')); DIMENSIONS.forEach(d=>assert.equal(p.axes[d].value,1));
 assert.equal(DIMENSIONS.reduce((sum,d)=>sum+p.axes[d].value,0),4);
});
test('response array order has no effect',()=>assert.deepEqual(scoreSession(bank,manifest,s,answers(s).reverse()),b));
test('display-option positions have no effect',()=>{
 const altered=structuredClone(s); altered.items.forEach(q=>q.display_option_ids.reverse());
 assert.deepEqual(scoreSession(bank,manifest,altered,answers(altered)),b);
});
test('different item sets can be scored in the same provisional coordinate system',()=>{
 const s2=make(1,{priorSessions:[s]}); assert.notDeepEqual(s2.items.map(x=>x.question_id),s.items.map(x=>x.question_id));
 const p2=scoreSession(bank,manifest,s2,answers(s2)); assert.equal(compareProfiles(b,p2,manifest).display_score,100);
});
test('opposite observed coordinates give zero similarity, not incompatibility',()=>{
 const lo=scoreSession(bank,manifest,s,answers(s,'a')),hi=scoreSession(bank,manifest,s,answers(s,'d'));
 const m=compareProfiles(lo,hi,manifest); assert.equal(m.display_score,0); assert.equal(m.is_probability,false);
});
test('pair score is symmetric and in range',()=>{
 const p=scoreSession(bank,manifest,s,answers(s,'d')); assert.deepEqual(compareProfiles(b,p,manifest),compareProfiles(p,b,manifest));
 assert(compareProfiles(b,p,manifest).display_score>=0&&compareProfiles(b,p,manifest).display_score<=100);
});
test('incomplete profile has no imputed axes and cannot be compared',()=>{
 const p=scoreSession(bank,manifest,s,answers(s).slice(1)); assert.equal(p.axes,null); assert.throws(()=>compareProfiles(p,b,manifest));
});
test('duplicate, unassigned, unknown-version and unknown-option responses rejected',()=>{
 const rs=answers(s); assert.throws(()=>scoreSession(bank,manifest,s,[rs[0],...rs.slice(0,11)]));
 for(const patch of [{question_id:'social_999'},{question_version:99},{option_id:'4'}]){
 const changed=structuredClone(rs); Object.assign(changed[0],patch); assert.throws(()=>scoreSession(bank,manifest,s,changed)); }
});
test('unlinked bank/scoring versions and hashes rejected',()=>{
 for(const key of ['bank_version','scoring_version','bank_sha256','scale_id']){
 const changed=structuredClone(b); changed[key]='other'; assert.throws(()=>compareProfiles(changed,b,manifest)); }
 const changed=structuredClone(s); changed.bank_sha256='wrong'; assert.throws(()=>scoreSession(bank,manifest,changed,answers(changed)));
});
test('unfamiliar anchor may be swapped without scoring the decline',()=>{
 const anchor=s.items.find(q=>q.is_anchor); const replaced=swapUnansweredItem(bank,manifest,s,anchor.question_id);
 assert.equal(replaced.items.length,12); assert.equal(replaced.anchor_exceptions.length,1);
 assert.equal(replaced.declined_items[0].question_id,anchor.question_id);
 assert.equal(scoreSession(bank,manifest,replaced,answers(replaced)).status,'provisional_snapshot');
 assert.throws(()=>swapUnansweredItem(bank,manifest,s,anchor.question_id,[{question_id:anchor.question_id}]));
});
test('group includes every participant; private, incomplete, and legacy profiles remain in roster',()=>{
 const legacy={...b,scale_id:'legacy'};
 const g=summarizeGroup([{id:'a',share_profile:true,profile:b},{id:'b',share_profile:true,profile:b},
   {id:'c',share_profile:true,profile:null},{id:'d',share_profile:false,profile:b},{id:'e',share_profile:true,profile:legacy}],manifest);
 assert.equal(g.roster.length,5); assert.equal(g.shared_complete_profiles,2);
 DIMENSIONS.forEach(d=>assert.equal(Object.values(g.axes[d].counts).reduce((a,b)=>a+b,0),2));
 assert.equal(g.roster[4].status,'unlinked_version'); assert.equal('closest' in g,false);
});
test('1,000 generated forms satisfy content and order constraints (engineering test, not a human pilot)',()=>{
 const ctx=new Map(bank.map(q=>[q.id,q.context])), groups=new Map(bank.map(q=>[q.id,q.overlap_group]));
 for(let i=0;i<1000;i++){
 const x=make(i,{chainId:`chain-${i%61}`,attempts:4});
 assert.equal(x.items.length,12); assert.equal(new Set(x.items.map(q=>q.question_id)).size,12);
 assert.equal(x.items.filter(q=>q.is_anchor).length,4);
 assert.equal(new Set(x.items.map(q=>q.facet)).size,12);
 const c={};x.items.forEach(q=>c[ctx.get(q.question_id)]=(c[ctx.get(q.question_id)]||0)+1);
 assert(Object.keys(c).length>=5); assert(Math.max(...Object.values(c))<=3);
 const gs=x.items.map(q=>groups.get(q.question_id)).filter(Boolean);assert.equal(new Set(gs).size,gs.length);
 for(let j=0;j<12;j+=4)assert.equal(new Set(x.items.slice(j,j+4).map(q=>q.dimension)).size,4);
 for(let j=1;j<12;j++)assert.notEqual(ctx.get(x.items[j].question_id),ctx.get(x.items[j-1].question_id));
 }
});
test('64-person chain retains common anchors and avoids identical question sets',()=>{
 const prior=[];for(let i=0;i<64;i++) prior.push(make(i,{chainId:'large-chain',priorSessions:prior,attempts:8}));
 const forms=prior.map(s=>s.items.map(q=>q.question_id).sort().join('|'));assert.equal(new Set(forms).size,64);
 const anchors=prior.map(s=>s.items.filter(q=>q.is_anchor).map(q=>q.question_id).sort().join('|'));
 assert.equal(new Set(anchors).size,1);
});


test('classic browser globals expose the same data and public API without CommonJS',()=>{
 const vm=require('node:vm'); const context=vm.createContext({TextEncoder});
 vm.runInContext(readFileSync(require.resolve('../preferences/data-v1.js'),'utf8'),context);
 vm.runInContext(readFileSync(require.resolve('../preferences/engine-v1.js'),'utf8'),context);
 assert.equal(vm.runInContext('PreferenceEngine.validateBank(PreferenceData.bank, PreferenceData.manifest)',context),true);
 assert.equal(vm.runInContext('typeof PreferenceEngine.band',context),'function');
});
test('same-facet swaps preserve content and exhaustion leaves the session unchanged',()=>{
 let current=structuredClone(s); const position=0; let exhausted=false;
 for(let i=0;i<8;i++){
  const before=structuredClone(current), row=current.items[position];
  try {
   current=swapUnansweredItem(bank,manifest,current,row.question_id);
   assert.equal(current.items[position].facet,row.facet);
   assert.equal(current.items[position].dimension,row.dimension);
   assert.equal(scoreSession(bank,manifest,current,answers(current)).status,'provisional_snapshot');
  } catch(error) {
   assert.match(error.message,/No same-facet replacement fits/);
   assert.deepEqual(current,before); exhausted=true; break;
  }
 }
 assert.equal(exhausted,true);
});
test('impossible selection exhausts bounded search explicitly without relaxing coverage',()=>{
 const impossible=structuredClone(manifest); impossible.selection.minimum_distinct_contexts=13;
 assert.throws(()=>assembleSession(bank,impossible,{chainId:'impossible',sessionId:'s',participantId:'p',attempts:256}),/search budget exhausted/);
});
test('bank validation rejects cross-loading and duplicate option IDs',()=>{
 const altered=structuredClone(bank); altered[0].options[0].weights.chill=1;
 assert.throws(()=>validateBank(altered,manifest),/Cross-loading/);
 const duplicated=structuredClone(bank); duplicated[0].options[0].id='b';
 assert.throws(()=>validateBank(duplicated,manifest),/stable option IDs/);
});


test('editorial revision preserves original bank structural fields and weight maps',()=>{
 const structural=bank.map(({prompt,options,...q})=>({...q,options:options.map(({text,rationale,...o})=>o)}));
 assert.equal(createHash('sha256').update(JSON.stringify(structural)).digest('hex'),'7359c4871c1303ffb12b8c1c750384857352ec93e4fe0d786db4f9701da87510');
 assert.equal(manifest.bank_version,'1.0.0-candidate-fun.1');
 assert.equal(manifest.language_revision,2);
 assert.equal(manifest.result_copy_version,'preference-snapshot-fun-1');
});
