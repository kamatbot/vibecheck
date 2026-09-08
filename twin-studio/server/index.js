import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createChatGPTService, ServiceError } from './chatgpt.js';

export function createApp({ service=createChatGPTService(), now=Date.now, port=8794 }={}) {
  // ponytail: desktop preview uses memory-only loopback sessions; public hosting needs per-user authentication and a credential-storage design.
  const sessions=new Map();
  const hosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`,'127.0.0.1:8793','localhost:8793']);
  const root=resolve('dist');
  function send(res,status,data) { res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data)); }
  return createServer(async(req,res)=>{
    try {
      const host=req.headers.host;
      if(!hosts.has(host))return send(res,403,{error:'This service is available on the local device only.'});
      const origin=`http://${host}`;
      if(req.headers.origin && req.headers.origin!==origin)return send(res,403,{error:'Request origin is not allowed.'});
      const url=new URL(req.url,origin);
      if(url.pathname.startsWith('/api/')) {
        if(req.method!=='GET' && req.headers.origin!==origin)return send(res,403,{error:'Request origin is required.'});
        const routes={'/api/chatgpt/status':['GET','status'],'/api/chatgpt/start':['POST','start'],'/api/chatgpt/poll':['POST','poll'],'/api/chatgpt/disconnect':['POST','disconnect'],'/api/chatgpt/design':['POST','design']};
        const route=routes[url.pathname];
        if(!route)return send(res,404,{error:'Unknown endpoint.'});
        if(req.method!==route[0])return send(res,405,{error:'Method not allowed.'});
        let body={};
        if(req.method==='POST') {
          if(!req.headers['content-type']?.startsWith('application/json'))return send(res,415,{error:'Send JSON content.'});
          let size=0; const chunks=[];
          for await(const chunk of req){size+=chunk.length;if(size>16384)throw new ServiceError('Request is too large.',413);chunks.push(chunk);}
          try{body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}catch{throw new ServiceError('Invalid JSON.',400);}
          if(!body||typeof body!=='object'||Array.isArray(body))throw new ServiceError('Invalid request.',400);
        }
        for(const [key,value] of sessions)if(value.expires<=now()){value.generation=(value.generation||0)+1;value.auth=null;value.flow=null;sessions.delete(key);}
        let id=req.headers.cookie?.split(';').map(value=>value.trim()).find(value=>value.startsWith('twin_session='))?.slice(13);
        let session=sessions.get(id);
        if(!session){
          if(sessions.size>=256)throw new ServiceError('Too many local sessions. Try again later.',429);
          id=randomBytes(32).toString('hex');session={expires:now()+8*60*60*1000};sessions.set(id,session);
          res.setHeader('Set-Cookie',`twin_session=${id}; HttpOnly; SameSite=Strict; Path=/api/chatgpt; Max-Age=28800`);
        }
        const result=await service[route[1]](session,body);
        return send(res,200,result);
      }
      if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'Method not allowed.'});
      const file=resolve(root,`.${decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname)}`);
      if(!file.startsWith(root+sep))return send(res,403,{error:'Invalid path.'});
      let content;try{content=await readFile(file);}catch{return send(res,404,{error:'Not found. Build the website first.'});}
      const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.wasm':'application/wasm'};
      res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:content);
    }catch(error){send(res,error instanceof ServiceError?error.status:500,{error:error instanceof ServiceError?error.message:'The request could not be completed.'});}
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  createApp().listen(8794,'127.0.0.1',()=>console.log('Twin Studio local service: http://127.0.0.1:8794'));
}
