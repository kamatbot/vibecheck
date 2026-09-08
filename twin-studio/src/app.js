import { DEFAULT_CONFIG, SHAPES, loadDesign, saveDesign, validateConfig } from './state.js';
import { analyzePhoto } from './photo.js';
import { createScene } from './scene.js';
import './styles.css';
import { createCoCreator } from './ai.js';

const app = document.querySelector('#app');
const swatches = {
  skin: ['#f0c4a1','#d99c75','#b67552','#7e4937','#573126'],
  eyeColor: ['#5c7269','#6b4b38','#3c312c','#465a72','#84945c'],
  hairColor: ['#49325f','#302522','#6f4935','#9d7254','#c8a879','#202124'],
  topColor: ['#a496ec','#c96d5d','#657a73','#41536b','#e9e4dc'],
  pantsColor: ['#34415d','#526b76','#786c5b','#313637','#d6c8b4'],
  shoeColor: ['#ede8df','#382f2d','#ff977d','#58636a','#d2b783']
};
const shapeGroups = {
  Face: ['FaceWidth','JawWidth','NoseWidth','NoseLength','EyeSize','EyeSpacing','LipFullness','Smile'],
  Hair: [], Body: ['BodyShape'], Style: []
};
const history = { past: [], future: [] };
let config = structuredClone(DEFAULT_CONFIG);
let selectedTab = 'Face';
let activeView = 'body';
let scene = null;
let sceneState = 'loading';
let pendingPhoto = false;
let previewURL = null;
let statusTimer = 0;
let activeNotice = '';
let activeNoticeTone = 'plain';
let focusAfterRender = null;
const ai = createCoCreator({ refresh: renderAI, getConfig: clone, apply: incoming => { const validated = validateConfig(incoming); commit(next => Object.assign(next, validated)); notice('AI design applied. Undo is available.'); } });

const icon = (name) => ({
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m0 0 4 4m-4-4L8 7M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>',
  undo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8 5 12l4 4M5 12h9a5 5 0 0 1 0 10h-1"/></svg>',
  redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 8 4 4-4 4m4-4h-9a5 5 0 0 0 0 10h1"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 2 5M20 4v7h-7"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>'
}[name]);

function safeName(){ return (config.name.normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'twin').slice(0,40); }
function notice(message, tone = 'plain') {
  activeNotice = message; activeNoticeTone = tone;
  const el = document.querySelector('#notice'); if (el) { el.textContent = message; el.dataset.tone = tone; }
  clearTimeout(statusTimer); statusTimer = setTimeout(() => { activeNotice = ''; const current = document.querySelector('#notice'); if(current)current.textContent = ''; }, 4500);
}
function clone(){ return structuredClone(config); }
function commit(mutator) { const before = clone(); const next = clone(); mutator(next); try { config = validateConfig(next); } catch (error) { notice(error.message,'error'); return; } history.past.push(before); if(history.past.length>30)history.past.shift(); history.future=[]; scene?.setConfig(config); render(); }
function render() {
  const aiFocus = document.activeElement?.id;
  const aiSelection = aiFocus === 'ai-prompt' ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  // createScene keeps a ResizeObserver and renderer against this exact node. Keep
  // the node itself through UI updates, including while its GLB request is pending.
  const existingStage = document.querySelector('#scene');
  const liveStage = existingStage && (scene || (sceneState === 'loading' && existingStage.childElementCount)) ? existingStage : null;
  app.innerHTML = `
    <main class="studio-shell">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="Twin Studio home"><span>Twin</span> Studio</a>
        <div class="project-name"><label for="twin-name">Twin name</label><input id="twin-name" maxlength="40" value="${escapeHtml(config.name)}" /></div>
        <div class="top-actions">
          <button class="icon-button" id="undo" title="Undo" ${history.past.length?'':'disabled'}>${icon('undo')}</button>
          <button class="icon-button" id="redo" title="Redo" ${history.future.length?'':'disabled'}>${icon('redo')}</button>
          <button class="quiet-button" id="save-design">Save</button>
          <div class="export-wrap"><button class="coral-button" id="export-menu">${icon('download')} Export</button><div class="export-popover" id="exports" hidden>
            <button data-export="png" ${sceneState==='ready'?'':'disabled'}>PNG portrait</button><button data-export="glb" ${sceneState==='ready'?'':'disabled'}>3D model (.glb)</button><button data-export="json">Design file (.json)</button><label class="import-file">Import design<input id="import-design" type="file" accept="application/json,.json"></label>
          </div></div>
        </div>
      </header>
      <section class="studio-layout" id="top">
        <aside class="identity-panel" aria-label="Your twin">
          <div class="identity-title"><p>Twin signal</p><h1>Make it<br><em>you.</em><span class="title-spark" aria-hidden="true">✳</span></h1></div>
          <div class="photo-area ${pendingPhoto?'is-busy':''}" id="photo-area">
            <div class="photo-art">${previewURL ? `<img src="${previewURL}" alt="Selected reference photo">` : icon('camera')}</div>
            <div><h2>Start with a selfie</h2><p>Photos stay on your device. A starting point, not an exact scan.</p></div>
            <label class="photo-button">${icon('upload')} ${pendingPhoto?'Reading photo…':'Upload photo'}<input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp" ${pendingPhoto?'disabled':''}></label>
            ${pendingPhoto ? '<p class="photo-status">Finding editable proportions…</p>' : '<button class="text-button" id="manual-start">Start by hand</button>'}
          </div>
          <section class="ai-panel" id="ai-panel" aria-label="AI co-creator"></section>
        </aside>
        <section class="stage-column" aria-label="Character preview">
          <div class="stage-toolbar"><span class="stage-label"><i></i>${sceneState==='ready'?'Live character':sceneState==='error'?'Preview unavailable':'Loading character'}</span><div><button class="view-toggle ${activeView==='face'?'active':''}" aria-pressed="${activeView==='face'}" id="face-view">Face view</button><button class="view-toggle ${activeView==='body'?'active':''}" aria-pressed="${activeView==='body'}" id="body-view">Body view</button><button class="reset-view" id="reset-view">${icon('reset')} Reset view</button></div></div>
          <div class="character-stage"><div id="scene" aria-label="Three-dimensional character preview"></div>${sceneState==='loading'?'<div class="stage-message"><span class="spinner"></span><strong>Preparing your character</strong><p>The editor is ready while the studio asset loads.</p></div>':''}${sceneState==='error'?'<div class="stage-message error"><strong>Character preview could not load</strong><p>Keep editing your design, or try the preview again.</p><button class="quiet-button" id="retry-scene">Try again</button></div>':''}</div>
          <p class="stage-caption">Drag to orbit · Scroll to zoom</p>
        </section>
        <aside class="inspector" aria-label="Character tools">
          <div class="tab-list" role="tablist" aria-label="Editing tools">${Object.keys(shapeGroups).map(tab=>`<button role="tab" aria-selected="${selectedTab===tab}" tabindex="${selectedTab===tab?'0':'-1'}" data-tab="${tab}">${tab}</button>`).join('')}</div>
          <div class="tool-content">${toolsMarkup()}</div>
        </aside>
      </section>
      <div id="notice" data-tone="${activeNoticeTone}" role="status" aria-live="polite">${escapeHtml(activeNotice)}</div>
    </main>`;
  if (liveStage) document.querySelector('#scene')?.replaceWith(liveStage);
  wireEvents();
  renderAI();
  if (aiFocus === 'ai-prompt' || aiFocus === 'ai-model') { const target = document.getElementById(aiFocus); target?.focus({ preventScroll: true }); if (aiSelection && target) target.setSelectionRange(...aiSelection); }
  if (focusAfterRender) { const target = document.querySelector(`#${focusAfterRender}`); focusAfterRender = null; requestAnimationFrame(() => target?.focus()); }
}
function renderAI() {
  const panel = document.querySelector('#ai-panel');
  if (!panel) return;
  const focused = panel.contains(document.activeElement) ? document.activeElement.id : null;
  const selection = focused === 'ai-prompt' ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
  const s = ai.state;
  panel.innerHTML = `<p class="ai-eyebrow">AI co-creator</p><h2>A little imagination.</h2>
    ${s.connected ? `<label for="ai-model">ChatGPT model</label><select id="ai-model" ${s.busy ? 'disabled' : ''}>${s.models.map(m => `<option value="${escapeHtml(m.id)}" ${m.id === s.model ? 'selected' : ''}>${escapeHtml(m.label)}</option>`).join('')}</select>${!s.models.length ? '<p>No account models available. Check connection to retry.</p>' : ''}<label for="ai-prompt">Describe your twin</label><textarea id="ai-prompt" maxlength="1000" rows="3" placeholder="A dreamy explorer in lilac…" ${s.busy === 'generate' ? 'disabled' : ''}>${escapeHtml(s.prompt)}</textarea><button class="photo-button" id="ai-generate" ${s.busy || !s.model || !s.prompt.trim() ? 'disabled' : ''}>${s.busy === 'generate' ? 'Imagining…' : 'Generate design'}</button><button class="text-button" id="ai-disconnect" ${s.busy ? 'disabled' : ''}>Disconnect</button>` : s.flow ? `<p>Enter this code in ChatGPT:</p><strong class="ai-code">${escapeHtml(s.flow.userCode)}</strong><a class="photo-button" href="https://auth.openai.com/codex/device" target="_blank" rel="noopener noreferrer">Open ChatGPT ↗</a><button class="text-button" id="ai-cancel">Cancel connection</button>` : `<button class="photo-button" id="ai-connect" ${s.busy ? 'disabled' : ''}>${s.busy === 'connect' ? 'Connecting…' : 'Connect ChatGPT'}</button>`}
    <p class="ai-disclosure">On Generate, your prompt and character settings go to OpenAI. Photos stay on your device.</p>
    <button class="text-button" id="ai-check" ${s.busy ? 'disabled' : ''}>${s.busy === 'status' ? 'Checking…' : s.unavailable ? 'Retry AI service' : 'Check connection'}</button>
    <p class="ai-error" role="status">${escapeHtml(s.error)}</p>`;
  panel.querySelector('#ai-connect')?.addEventListener('click', ai.start);
  panel.querySelector('#ai-check')?.addEventListener('click', () => s.flow ? ai.poll() : ai.status());
  panel.querySelector('#ai-cancel')?.addEventListener('click', ai.cancel);
  panel.querySelector('#ai-disconnect')?.addEventListener('click', ai.disconnect);
  panel.querySelector('#ai-generate')?.addEventListener('click', ai.generate);
  panel.querySelector('#ai-model')?.addEventListener('change', event => { s.model = event.target.value; });
  panel.querySelector('#ai-prompt')?.addEventListener('input', event => { s.prompt = event.target.value; panel.querySelector('#ai-generate').disabled = !!s.busy || !s.model || !s.prompt.trim(); });
  if (focused) { const target = document.getElementById(focused); target?.focus({ preventScroll: true }); if (selection && target) target.setSelectionRange(...selection); }
}
function toolsMarkup() {
  if (selectedTab === 'Hair') return `<div class="tool-heading"><h2>Hair</h2><p>Choose a silhouette, then set its tone.</p></div><div class="hair-grid">${['crop','waves','bob','long'].map(h=>`<button class="hair-choice ${config.hair===h?'selected':''}" data-hair="${h}"><span class="hair-silhouette ${h}" aria-hidden="true"></span><b>${h}</b></button>`).join('')}</div>${colorControl('hairColor','Hair color')}`;
  if (selectedTab === 'Style') return `<div class="tool-heading"><h2>Style</h2><p>Build a simple wardrobe palette.</p></div>${colorControl('topColor','Top')}${colorControl('pantsColor','Pants')}${colorControl('shoeColor','Shoes')}`;
  const items = shapeGroups[selectedTab];
  return `<div class="tool-heading"><h2>${selectedTab}</h2><p>${selectedTab==='Face'?'Small moves make a big difference.':'Balance silhouette and height.'}</p></div>${items.map(shapeControl).join('')}${selectedTab==='Face'?colorControl('skin','Skin tone')+colorControl('eyeColor','Eye color'):heightControl()}`;
}
function shapeControl(key) { const value=config.shape[key]; const min=['Smile','BodyShape'].includes(key)?0:-1; return `<label class="range-control" for="shape-${key}"><span>${humanize(key)}</span><output>${formatValue(key,value)}</output><input id="shape-${key}" data-shape="${key}" type="range" min="${min}" max="1" step="0.01" value="${value}"></label>`; }
function heightControl(){ return `<label class="range-control" for="height"><span>Height</span><output>${config.height.toFixed(2)}×</output><input id="height" type="range" min="0.9" max="1.1" step="0.01" value="${config.height}"></label>`; }
function colorControl(key,label) { return `<fieldset class="color-control"><legend>${label}</legend><div class="swatches">${swatches[key].map(color=>`<button class="swatch ${config[key].toLowerCase()===color?'selected':''}" style="--swatch:${color}" data-color-key="${key}" data-color="${color}" aria-label="${label}: ${color}"></button>`).join('')}<label class="custom-color" title="Custom ${label}"><input type="color" data-custom-color="${key}" value="${config[key]}" aria-label="Custom ${label}"></label></div></fieldset>`; }
function humanize(key){ return key.replace(/([a-z])([A-Z])/g,'$1 $2'); }
function formatValue(key,v){ if(key==='Smile'||key==='BodyShape')return `${Math.round(v*100)}%`; return v===0?'Neutral':v>0?`+${Math.round(v*100)}`:`${Math.round(v*100)}`; }
function escapeHtml(value){ return value.replace(/[&<>'"]/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
function wireEvents(){
  const nameInput = document.querySelector('#twin-name');
  let nameBefore = null;
  nameInput.addEventListener('input', () => {
    nameBefore ??= clone();
    config.name = nameInput.value.trim() || 'My twin';
  });
  const finishName = () => {
    if (nameBefore && nameBefore.name !== config.name) {
      history.past.push(nameBefore);
      if (history.past.length > 30) history.past.shift();
      history.future = [];
      document.querySelector('#undo').disabled = false;
      document.querySelector('#redo').disabled = true;
    }
    nameBefore = null;
    nameInput.value = config.name;
  };
  nameInput.addEventListener('change', finishName);
  nameInput.addEventListener('blur', finishName);
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{selectedTab=button.dataset.tab; if(selectedTab==='Face'||selectedTab==='Hair'){activeView='face';scene?.setView('face');} else if(selectedTab==='Body'){activeView='body';scene?.setView('body');} render();}));
  document.querySelectorAll('[data-tab]').forEach((button,index,buttons)=>button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();buttons[(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length].click();document.querySelectorAll('[data-tab]')[(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length].focus();}));
  document.querySelectorAll('[data-shape]').forEach(input=>{let before;const begin=()=>{before ??= clone();};input.addEventListener('pointerdown',begin);input.addEventListener('keydown',begin);input.addEventListener('input',()=>{const next=clone();next.shape[input.dataset.shape]=Number(input.value);config=validateConfig(next);scene?.setConfig(config);input.closest('.range-control').querySelector('output').textContent=formatValue(input.dataset.shape,Number(input.value));});input.addEventListener('change',()=>{if(before&&JSON.stringify(before)!==JSON.stringify(config)){history.past.push(before);if(history.past.length>30)history.past.shift();history.future=[];}focusAfterRender=input.id;render();});});
  const height=document.querySelector('#height'); if(height){let before;const begin=()=>{before ??= clone();};height.addEventListener('pointerdown',begin);height.addEventListener('keydown',begin);height.addEventListener('input',()=>{const next=clone();next.height=Number(height.value);config=validateConfig(next);scene?.setConfig(config);height.closest('.range-control').querySelector('output').textContent=`${config.height.toFixed(2)}×`;});height.addEventListener('change',()=>{if(before&&JSON.stringify(before)!==JSON.stringify(config)){history.past.push(before);if(history.past.length>30)history.past.shift();history.future=[];}focusAfterRender='height';render();});}
  document.querySelectorAll('[data-hair]').forEach(button=>button.addEventListener('click',()=>commit(next=>next.hair=button.dataset.hair)));
  document.querySelectorAll('[data-color-key]').forEach(button=>button.addEventListener('click',()=>commit(next=>next[button.dataset.colorKey]=button.dataset.color)));
  document.querySelectorAll('[data-custom-color]').forEach(input=>input.addEventListener('change',()=>commit(next=>next[input.dataset.customColor]=input.value)));
  document.querySelector('#photo-input').addEventListener('change', handlePhoto);
  document.querySelector('#manual-start')?.addEventListener('click',()=>{const firstTool=document.querySelector('.tool-content input, .tool-content button');firstTool?.scrollIntoView({behavior:'smooth',block:'center'});firstTool?.focus();notice('Manual controls are ready.');});
  document.querySelector('#undo').addEventListener('click',()=>{const prior=history.past.pop();if(!prior)return;history.future.push(clone());if(history.future.length>30)history.future.shift();config=prior;scene?.setConfig(config);render();});
  document.querySelector('#redo').addEventListener('click',()=>{const next=history.future.pop();if(!next)return;history.past.push(clone());if(history.past.length>30)history.past.shift();config=next;scene?.setConfig(config);render();});
  document.querySelector('#save-design').addEventListener('click',()=>{try{saveDesign(config);notice('Design saved in this browser.');}catch{notice('Your browser could not save this design.','error');}});
  document.querySelector('#export-menu').addEventListener('click',()=>{const menu=document.querySelector('#exports');menu.hidden=!menu.hidden;});
  document.querySelectorAll('[data-export]').forEach(button=>button.addEventListener('click',()=>doExport(button.dataset.export)));
  document.querySelector('#import-design').addEventListener('change', importDesign);
  document.querySelector('#face-view').addEventListener('click',()=>{activeView='face';scene?.setView('face');render();});
  document.querySelector('#body-view').addEventListener('click',()=>{activeView='body';scene?.setView('body');render();});
  document.querySelector('#reset-view').addEventListener('click',()=>scene?.resetCamera());
  document.querySelector('#retry-scene')?.addEventListener('click', startScene);
}
async function handlePhoto(event){ const file=event.target.files?.[0];event.target.value='';if(!file)return; if(previewURL)URL.revokeObjectURL(previewURL);previewURL=URL.createObjectURL(file);pendingPhoto=true;render();try{const result=await analyzePhoto(file);commit(next=>{next.shape={...next.shape,...result.shape};if(result.skin)next.skin=result.skin;});notice('Photo suggestion applied. Adjust anything you like.');}catch(error){notice(error.message,'error');}finally{if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}pendingPhoto=false;render();}}
function download(blob,name){const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),500);}
async function doExport(kind){try{if(kind==='json'){download(new Blob([JSON.stringify(config,null,2)],{type:'application/json'}),`${safeName()}-twin.json`);notice('Design file downloaded.');}if(kind==='png'){const url=scene?.capture();if(!url)throw Error('The character preview is not ready yet.');const blob=await fetch(url).then(r=>r.blob());download(blob,`${safeName()}-twin.png`);notice('Portrait downloaded.');}if(kind==='glb'){const blob=await scene?.exportGLB();if(!blob)throw Error('The character preview is not ready yet.');download(blob,`${safeName()}-twin.glb`);notice('3D model downloaded.');}}catch(error){notice(error.message,'error');}document.querySelector('#exports').hidden=true;}
async function importDesign(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;if(file.size>100*1024){notice('Choose a design file smaller than 100 KB.','error');return;}try{const incoming=validateConfig(JSON.parse(await file.text()));commit(next=>Object.assign(next,incoming));notice('Design imported.');}catch(error){notice(`Could not import design: ${error.message}`,'error');}}
async function startScene(){scene?.dispose();scene=null;sceneState='loading';render();try{const container=document.querySelector('#scene');scene=await createScene(container,{onProgress:()=>{}});scene.setConfig(config);scene.setView(activeView);sceneState='ready';document.querySelector('.stage-message')?.remove();const label=document.querySelector('.stage-label');if(label)label.innerHTML='<i></i>Live character';document.querySelectorAll('[data-export="png"],[data-export="glb"]').forEach(button=>button.disabled=false);}catch(error){sceneState='error';render();notice('The character asset could not load. Try again when it is available.','error');}}
try { const stored=loadDesign(); if(stored) config=stored; } catch { notice('Saved design could not be restored. Starting fresh.','error'); }
render(); startScene(); ai.status();
