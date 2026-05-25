/**
 * Interactive 3D character with wave / hi gesture (GLTF + Three.js)
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "https://threejs.org/examples/models/gltf/RobotExpressive.glb";

let gltfCache = null;

async function loadModel() {
  if (gltfCache) return gltfCache;
  const loader = new GLTFLoader();
  gltfCache = await loader.loadAsync(MODEL_URL);
  return gltfCache;
}

function findClip(animations, names) {
  for (const name of names) {
    const clip = animations.find(
      (a) => a.name.toLowerCase() === name.toLowerCase() || a.name.toLowerCase().includes(name.toLowerCase()),
    );
    if (clip) return clip;
  }
  return animations[0] || null;
}

function styleAsGuide(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (m.color) {
          m.color.setHex(0x3b82f6);
        }
        if (m.emissive) {
          m.emissive.setHex(0x1e40af);
          m.emissiveIntensity = 0.15;
        }
        m.metalness = Math.min(m.metalness ?? 0, 0.35);
        m.roughness = Math.max(m.roughness ?? 0.5, 0.45);
      });
    }
  });
}

export async function mountCharacter(canvas, options = {}) {
  if (!canvas) return null;

  const { scale = 0.45, yOffset = -0.9, xOffset = 0 } = options;

  const parent = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.2, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0xe0e7ff, 1.1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 6, 4);
  key.castShadow = true;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x93c5fd, 0.6);
  fill.position.set(-4, 2, 2);
  scene.add(fill);

  const gltf = await loadModel();
  const model = gltf.scene.clone(true);
  styleAsGuide(model);
  model.scale.setScalar(scale);
  model.position.y = yOffset;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  const waveClip = findClip(gltf.animations, ["wave", "hi", "yes", "idle"]);
  const idleClip = findClip(gltf.animations, ["idle", "standing"]);

  let waveAction = null;
  let idleAction = null;

  if (waveClip) {
    waveAction = mixer.clipAction(waveClip);
    waveAction.setLoop(THREE.LoopOnce, 1);
    waveAction.clampWhenFinished = true;
  }
  if (idleClip && idleClip !== waveClip) {
    idleAction = mixer.clipAction(idleClip);
    idleAction.setLoop(THREE.LoopRepeat, Infinity);
  }

  function playHi() {
    if (!waveAction) {
      idleAction?.play();
      return;
    }
    if (idleAction) idleAction.fadeOut(0.25);
    waveAction.reset().fadeIn(0.25).play();

    const onFinished = (e) => {
      if (e.action !== waveAction) return;
      mixer.removeEventListener("finished", onFinished);
      waveAction.fadeOut(0.35);
      if (idleAction) idleAction.reset().fadeIn(0.35).play();
    };
    mixer.addEventListener("finished", onFinished);
  }

  playHi();
  setInterval(() => {
    if (document.visibilityState === "visible") playHi();
  }, 9000);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  parent?.addEventListener("mousemove", (e) => {
    const r = parent.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 1.2;
    mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
  });
  parent?.addEventListener("mouseleave", () => {
    mouse.tx = 0;
    mouse.ty = 0;
  });

  let visible = true;
  const obs = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { threshold: 0.08 },
  );
  if (parent) obs.observe(parent);

  const clock = new THREE.Clock();

  function resize() {
    const w = parent?.clientWidth || canvas.clientWidth || 400;
    const h = parent?.clientHeight || canvas.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  const ro = new ResizeObserver(resize);
  if (parent) ro.observe(parent);

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    if (visible) {
      mixer.update(dt);
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      model.rotation.y = mouse.x * 0.45;
      model.rotation.x = mouse.y * 0.12;
      model.position.y = yOffset + Math.sin(clock.elapsedTime * 0.8) * 0.03;
      model.position.x = xOffset;
    }
    renderer.render(scene, camera);
  }
  animate();

  return { playHi, model };
}
