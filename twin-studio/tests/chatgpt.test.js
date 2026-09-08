import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatGPTService } from '../server/chatgpt.js';
import { createApp } from '../server/index.js';
import { DEFAULT_CONFIG } from '../src/state.js';
const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const auth=()=>({access:'test',refresh:'refresh',expiry:9999999999999});

test('device flow keeps provider credentials private and obeys polling interval',async()=>{
  let time=0,calls=0;
  const service=createChatGPTService({now:()=>time,fetchImpl:async(url)=>{
    calls++;
    if(url.endsWith('/usercode'))return response({user_code:'CODE',device_auth_id:'PRIVATE',interval:3});
    if(url.endsWith('/deviceauth/token'))return response({authorization_code:'AUTH',code_verifier:'VERIFIER'});
    if(url.endsWith('/oauth/token'))return response({access_token:'ACCESS',refresh_token:'REFRESH',expires_in:3600});
    return response({models:[{slug:'available'},{slug:'excluded-pro'}]});
  }});
  const session={},start=await service.start(session);
  assert.equal(JSON.stringify(start).includes('PRIVATE'),false);
  assert.deepEqual(await service.poll(session,{flowId:start.flowId}),{status:'pending'});assert.equal(calls,1);
  time=3000;
  assert.deepEqual(await service.poll(session,{flowId:start.flowId}),{status:'connected',models:['available']});
  assert.equal(JSON.stringify(await service.status(session)).includes('ACCESS'),false);
  await service.disconnect(session);assert.equal(session.auth,null);
});
test('disconnect invalidates in-flight device authorization',async()=>{
  let time=0,release;
  const service=createChatGPTService({now:()=>time,fetchImpl:async(url)=>{
    if(url.endsWith('/usercode'))return response({user_code:'CODE',device_auth_id:'PRIVATE'});
    if(url.endsWith('/deviceauth/token'))return new Promise(resolve=>{release=()=>resolve(response({authorization_code:'AUTH',code_verifier:'VERIFIER'}));});
    return response({access_token:'ACCESS',refresh_token:'REFRESH',expires_in:3600});
  }});
  const session={},start=await service.start(session);time=5000;
  const pending=service.poll(session,{flowId:start.flowId});await service.disconnect(session);release();
  await assert.rejects(pending,/cancelled/);assert.equal(session.auth,null);
});
test('design requires discovered model and validates upstream configuration',async()=>{
  let sent;
  const service=createChatGPTService({fetchImpl:async(url,options)=>{sent=JSON.parse(options.body);return new Response('data: '+JSON.stringify({type:'response.output_text.delta',delta:JSON.stringify({...DEFAULT_CONFIG,name:'AI twin'})})+'\n\ndata: {"type":"response.completed"}\n\n');}});
  const session={auth:auth(),models:['available']};
  const result=await service.design(session,{prompt:'Change my outfit',config:DEFAULT_CONFIG});
  assert.equal(result.config.name,'AI twin');assert.equal(sent.store,false);assert.equal(sent.model,'available');assert.equal(sent.tools,undefined);
  await assert.rejects(service.design(session,{prompt:'x',config:DEFAULT_CONFIG,model:'invented'}),/available/);
  const invalid=createChatGPTService({fetchImpl:async()=>new Response('data: '+JSON.stringify({type:'response.output_text.delta',delta:'{"version":99}'})+'\ndata: {"type":"response.completed"}\n')});
  await assert.rejects(invalid.design(session,{prompt:'x',config:DEFAULT_CONFIG}),/invalid design/);
});
test('refresh is serialized and disconnect cannot restore tokens',async()=>{
  let release,calls=0;
  const service=createChatGPTService({fetchImpl:async()=>{calls++;return new Promise(resolve=>{release=()=>resolve(response({access_token:'NEW',refresh_token:'NEWREFRESH',expires_in:3600}));});}});
  const session={auth:{...auth(),expiry:0},models:['available']};
  const a=service.design(session,{prompt:'x',config:DEFAULT_CONFIG});
  const b=service.design(session,{prompt:'x',config:DEFAULT_CONFIG});
  assert.equal(calls,1);await service.disconnect(session);release();
  await assert.rejects(a,/Connect/);await assert.rejects(b,/Connect/);assert.equal(session.auth,null);
});
test('HTTP service enforces origin, private cookie, body limit and session isolation',async(t)=>{
  const service={status:async s=>({connected:!!s.auth}),start:async s=>{s.auth=true;return {flowId:'test'};}};
  const app=createApp({service,port:18894});await new Promise(resolve=>app.listen(18894,'127.0.0.1',resolve));t.after(()=>app.close());
  const base=`http://127.0.0.1:${app.address().port}`;
  const headers={Origin:base,'Content-Type':'application/json'};
  assert.equal((await fetch(base+'/api/chatgpt/start',{method:'POST',headers:{...headers,Origin:'http://evil.test'},body:'{}'})).status,403);
  const start=await fetch(base+'/api/chatgpt/start',{method:'POST',headers,body:'{}'});
  const cookie=start.headers.get('set-cookie');assert.match(cookie,/HttpOnly; SameSite=Strict/);
  assert.equal((await(await fetch(base+'/api/chatgpt/status',{headers:{...headers,Cookie:cookie.split(';')[0]}})).json()).connected,true);
  assert.equal((await(await fetch(base+'/api/chatgpt/status',{headers})).json()).connected,false);
  assert.equal((await fetch(base+'/api/chatgpt/start',{method:'POST',headers,body:JSON.stringify({x:'x'.repeat(17000)})})).status,413);
});
test('401 refreshes once; allowance errors never expose upstream details',async()=>{
  let requests=0,refreshes=0;
  const service=createChatGPTService({fetchImpl:async(url)=>{
    if(url.endsWith('/oauth/token')){refreshes++;return response({access_token:'NEW',refresh_token:'ROTATED',expires_in:3600});}
    requests++;if(requests===1)return response({secret:'private'},401);
    return response({secret:'private'},429);
  }});
  const session={auth:auth(),models:['available']};
  await assert.rejects(service.design(session,{prompt:'x',config:DEFAULT_CONFIG}),error=>error.status===429&&!error.message.includes('private'));
  assert.equal(requests,2);assert.equal(refreshes,1);assert.equal(session.auth.refresh,'ROTATED');
});
test('status recovers missing models; complete JSON without terminal success is rejected',async()=>{
  const session={auth:auth()};
  const service=createChatGPTService({fetchImpl:async(url)=>url.includes('/models?')?response({models:[{slug:'available'}]}):new Response('data: '+JSON.stringify({type:'response.output_text.delta',delta:JSON.stringify(DEFAULT_CONFIG)})+'\n')});
  assert.deepEqual(await service.status(session),{connected:true,models:['available']});
  await assert.rejects(service.design(session,{prompt:'x',config:DEFAULT_CONFIG}),/interrupted/);
});
