import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export async function createScene(container, { onProgress = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D twin. Drag to rotate; use the face and full-body buttons to change framing.');
  renderer.domElement.style.touchAction = 'none';
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(30, 1, .01, 40);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .08;
  controls.rotateSpeed = .45;
  controls.enablePan = false;
  controls.minPolarAngle = .35;
  controls.maxPolarAngle = Math.PI / 2 + .12;
  scene.add(new THREE.HemisphereLight('#fff8f2', '#d0ced4', 2.4));
  const key = new THREE.DirectionalLight('#fff7f1', 2);
  key.position.set(2, 3, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2.8, bottom: -1, near: .1, far: 15 });
  key.shadow.normalBias = .015;
  key.shadow.bias = -.0001;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#edf2ff', 1.2);
  fill.position.set(-4, 2, 1);
  scene.add(fill);
  const rim = new THREE.DirectionalLight('#b5ffe7', 1.5);
  rim.position.set(1, 3, -3);
  scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.007;
  floor.receiveShadow = true;
  scene.add(floor);
  let model, frame, disposed = false, view = 'body', stature = 1, modelHeight = 1.75;
  function render() {
    cancelAnimationFrame(frame);
    if (disposed || document.hidden) return;
    frame = requestAnimationFrame(() => { controls.update(); renderer.render(scene, camera); });
  }
  controls.addEventListener('change', render);
  function fit() {
    const height = modelHeight * stature;
    const face = view === 'face';
    const targetY = height * (face ? .87 : .5);
    const framedHeight = height * (face ? .36 : 1.14);
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = framedHeight / (2 * Math.tan(halfFov)) * Math.max(1, .64 / camera.aspect);
    camera.position.set(face ? .025 : .12, targetY + (face ? .015 : .04), distance);
    controls.target.set(0, targetY, 0);
    controls.minDistance = face ? .38 : height * .75;
    controls.maxDistance = height * 5;
    controls.update();
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden) render(); };
  document.addEventListener('visibilitychange', visibility);
  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    controls.dispose();
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of object.material ? [].concat(object.material) : []) materials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) { for (const value of Object.values(material)) if (value?.isTexture) value.dispose(); material.dispose(); }
    renderer.dispose();
    renderer.domElement.remove();
  }
  try {
    const gltf = await new GLTFLoader().loadAsync('/models/twin.glb', event => onProgress(event.total ? Math.round(event.loaded / event.total * 95) : 0));
    model = gltf.scene;
    model.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = false; } });
    scene.add(model);
    modelHeight = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y;
    resize();
    render();
    onProgress(100);
  } catch (error) {
    dispose();
    throw new Error('The character could not load. Check your connection and try again.', { cause: error });
  }
  return {
    setConfig(config) {
      const colors = { Skin: config.skin, Hair: config.hairColor, Brows: config.hairColor, Iris: config.eyeColor, Iris_Inner: config.eyeColor, Iris_Rim: config.eyeColor, Iris_Fiber: config.eyeColor, Top: config.topColor, Top_Seam: config.topColor, Pants: config.pantsColor, Pants_Seam: config.pantsColor, Shoes: config.shoeColor, Shoe_Panel: config.shoeColor };
      const shades = { Iris_Inner: .8, Iris_Rim: .5, Iris_Fiber: 1.2, Top_Seam: .84, Pants_Seam: .8, Shoe_Panel: .9 };
      const hair = `Hair_${config.hair[0].toUpperCase()}${config.hair.slice(1)}`;
      model.traverse(object => {
        if (/^Hair_(Crop|Waves|Bob|Long)$/.test(object.name)) object.visible = object.name === hair;
        if (object.morphTargetDictionary) for (const [name, index] of Object.entries(object.morphTargetDictionary)) {
          if (name in config.shape) object.morphTargetInfluences[index] = config.shape[name];
        }
        for (const material of object.material ? [].concat(object.material) : []) {
          if (colors[material.name] && material.color) material.color.set(colors[material.name]).multiplyScalar(shades[material.name] ?? 1);
          if (material.name === 'Lips') material.color.set(config.skin).lerp(new THREE.Color('#a74646'), .3);
        }
      });
      model.scale.y = config.height;
      if (stature !== config.height) { stature = config.height; fit(); }
      render();
    },
    setView(next) { view = next === 'face' ? 'face' : 'body'; fit(); },
    resetCamera: fit,
    capture() {
      renderer.render(scene, camera);
      const canvas = document.createElement('canvas');
      canvas.width = renderer.domElement.width; canvas.height = renderer.domElement.height;
      const context = canvas.getContext('2d');
      context.fillStyle = '#121521'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(renderer.domElement, 0, 0);
      return canvas.toDataURL('image/png');
    },
    async exportGLB() {
      const binary = await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true });
      return new Blob([binary], { type: 'model/gltf-binary' });
    },
    dispose,
  };
}
