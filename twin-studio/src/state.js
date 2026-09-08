export const SHAPES = ['FaceWidth','JawWidth','NoseWidth','NoseLength','EyeSize','EyeSpacing','LipFullness','Smile','BodyShape'];
export const DEFAULT_CONFIG = {version:1,name:'My twin',hair:'waves',skin:'#c68d6a',hairColor:'#49325f',eyeColor:'#6b4b38',topColor:'#a496ec',pantsColor:'#34415d',shoeColor:'#ff977d',height:1,shape:{FaceWidth:0,JawWidth:0,NoseWidth:0,NoseLength:0,EyeSize:0,EyeSpacing:0,LipFullness:0,Smile:0.15,BodyShape:0}};
export function validateConfig(input) {
  if(!input||input.version!==1)throw Error('This design uses an unsupported version.');
  const next=structuredClone(DEFAULT_CONFIG);
  if(typeof input.name!=='string'||Array.from(input.name).length>40)throw Error('Use a name of 40 characters or fewer.');
  next.name=input.name;
  if(!['crop','waves','bob','long'].includes(input.hair))throw Error('Unknown hairstyle.');
  next.hair=input.hair;
  for(const key of ['skin','hairColor','eyeColor','topColor','pantsColor','shoeColor']){
    if(typeof input[key]!=='string'||!/^#[\da-f]{6}$/i.test(input[key]))throw Error('A color in this design is invalid.');
    next[key]=input[key];
  }
  if(!Number.isFinite(input.height)||input.height<.9||input.height>1.1)throw Error('Height is outside the editor range.');
  next.height=input.height;
  for(const key of SHAPES){const value=input.shape?.[key],min=['Smile','BodyShape'].includes(key)?0:-1;
    if(!Number.isFinite(value)||value<min||value>1)throw Error('A face or body control is outside the editor range.');
    next.shape[key]=value;
  }
  return next;
}
export function saveDesign(config){localStorage.setItem('twin-studio-design-v1',JSON.stringify(validateConfig(config)));}
export function loadDesign(){const raw=localStorage.getItem('twin-studio-design-v1');return raw?validateConfig(JSON.parse(raw)):null;}
