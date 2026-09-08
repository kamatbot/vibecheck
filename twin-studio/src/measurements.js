// Photo proportions provide a gentle resemblance without reaching the manual sculpt extremes.
const clamp=x=>Math.max(-.4,Math.min(.4,x*.4));
// ponytail: photo suggestions use at most 40% of each sculpt range; exact likeness would need a separately calibrated model.
export function estimateFeatures(points,width,height) {
  if(!Array.isArray(points)||points.length<468||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('The face could not be measured. Try a clear, front-facing photo.');
  const p=i=>{const v=points[i];if(!v||!Number.isFinite(v.x)||!Number.isFinite(v.y))throw Error('The face could not be measured.');return {x:v.x*width,y:v.y*height}};
  const dist=(a,b)=>{const A=p(a),B=p(b);return Math.hypot(A.x-B.x,A.y-B.y)};
  const fw=dist(234,454),fh=dist(10,152),eyes=dist(33,263);
  if(fw<40||fh<50||eyes<20)throw Error('Your face is too small in this photo. Try a closer portrait.');
  const left=p(33),right=p(263),nose=p(1),eyeMid=(left.x+right.x)/2;
  if(Math.abs(Math.atan2(right.y-left.y,right.x-left.x))>.36||Math.abs(nose.x-eyeMid)/eyes>.2)throw Error('Face the camera a little more directly, then try again.');
  const mouth=dist(61,291);
  return {
    FaceWidth:clamp((fw/fh-.76)/.18),
    JawWidth:clamp((dist(172,397)/fw-.78)/.18),
    NoseWidth:clamp((dist(98,327)/fw-.22)/.08),
    NoseLength:clamp((dist(168,2)/fh-.22)/.08),
    EyeSize:clamp(((dist(33,133)+dist(362,263))/2/fw-.20)/.055),
    EyeSpacing:clamp((dist(133,362)/fw-.23)/.07),
    LipFullness:clamp((dist(0,17)/Math.max(1,mouth)-.31)/.14)
  };
}
export function sampleSkin(ctx,points,width,height){
  const colors=[];
  for(const i of [50,101,280,330]){
    const p=points[i];if(!p)continue;
    const x=Math.max(2,Math.min(width-3,Math.round(p.x*width))),y=Math.max(2,Math.min(height-3,Math.round(p.y*height)));
    const data=ctx.getImageData(x-2,y-2,5,5).data;
    for(let j=0;j<data.length;j+=4)if(data[j+3]>240)colors.push([data[j],data[j+1],data[j+2]]);
  }
  if(!colors.length)return null;
  const rgb=[0,1,2].map(channel=>colors.map(c=>c[channel]).sort((a,b)=>a-b)[Math.floor(colors.length/2)]);
  return '#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');
}
