// Only model assets are fetched. Photos and facial landmarks never leave this browser.
export async function analyzePhoto(file) {
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choose a JPG, PNG or WebP photo.');
  if(file.size>12*1024*1024)throw Error('Choose a photo smaller than 12 MB.');
  let decoded;
  try { decoded=await createImageBitmap(file); } catch { throw Error('This photo could not be opened. Try a different JPG, PNG or WebP.'); }
  if(decoded.width*decoded.height>32_000_000){decoded.close();throw Error('Choose a photo under 32 megapixels.');}
  const scale=Math.min(1,1280/Math.max(decoded.width,decoded.height));
  let bitmap;
  try { bitmap=await createImageBitmap(decoded,{resizeWidth:Math.max(1,Math.round(decoded.width*scale)),resizeHeight:Math.max(1,Math.round(decoded.height*scale))}); } finally { decoded.close(); }
  return new Promise((resolve,reject)=>{
    let worker;
    try { worker=new Worker(new URL('./photo.worker.js',import.meta.url),{type:'module'}); } catch { bitmap.close(); reject(Error('Photo tools are unavailable in this browser. You can still build your twin manually.')); return; }
    const cleanup=()=>{clearTimeout(timer);worker.terminate()};
    const timer=setTimeout(()=>{cleanup();reject(Error('Photo analysis took too long. Try again, or start with the manual controls.'));},45000);
    worker.onmessage=({data})=>{cleanup();data.error?reject(Error(data.error)):resolve(data)};
    worker.onerror=()=>{cleanup();reject(Error('Photo tools could not load. You can still build your twin manually.'))};
    worker.postMessage({bitmap},[bitmap]);
  });
}
