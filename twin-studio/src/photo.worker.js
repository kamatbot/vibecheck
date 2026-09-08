import {FaceLandmarker,FilesetResolver} from '@mediapipe/tasks-vision';
import {estimateFeatures,sampleSkin} from './measurements.js';
let detector;
// An absolute same-origin URL avoids Vite treating a public runtime as a source import.
self.import = url => import(/* @vite-ignore */ new URL(url, self.location.origin).href);
self.onmessage=async({data})=>{
  const bitmap=data.bitmap;
  try{
    if(!detector){const files=await FilesetResolver.forVisionTasks('/vision',true);detector=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'/vision/face_landmarker.task',delegate:'CPU'},runningMode:'IMAGE',numFaces:2});}
    const result=detector.detect(bitmap);
    if(result.faceLandmarks.length!==1)throw Error(result.faceLandmarks.length?'Use a photo with just one person.':'No face found. Try a brighter, front-facing portrait.');
    const points=result.faceLandmarks[0],shape=estimateFeatures(points,bitmap.width,bitmap.height);
    const canvas=new OffscreenCanvas(bitmap.width,bitmap.height),ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);
    const skin=sampleSkin(ctx,points,bitmap.width,bitmap.height);
    self.postMessage({shape,skin});canvas.width=1;canvas.height=1;
  }catch(error){self.postMessage({error:error.message||'The photo could not be read. Try another portrait.'});}
  finally{bitmap?.close();}
};
