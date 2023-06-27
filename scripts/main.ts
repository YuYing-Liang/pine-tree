import * as THREE from "three";
import {
  getAnimateStatus,
  onClickScene,
  onPointerMove,
  responsive,
  setAnimate,
} from "./events";
import { animateTree, generateTree, removeTree } from "./tree";
import { degToRad } from "three/src/math/MathUtils";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// CONSTANTS
const INIT_CAM_X = 0;
const INIT_CAM_Y = 0;
const INIT_CAM_Z = 85;

// CAMERA & SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
scene.background = new THREE.Color(200, 200, 200);
camera.position.set(INIT_CAM_X, INIT_CAM_Y, INIT_CAM_Z);
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth-25, window.innerHeight-25);
renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

// AXES
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// RAYS
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// LIGHTING
const ambientLight = new THREE.AmbientLight();
const pointLight = new THREE.PointLight();
pointLight.position.set(10, 10, 10);
scene.add(ambientLight);
scene.add(pointLight);

// CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.saveState();

// SHAPES BEING DISPLAYED
const defaultTree = () => generateTree(scene, 2, 4, degToRad(50));
let treeBase = defaultTree();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  if (getAnimateStatus()) animateTree(treeBase!!);
  // For debugging rotation animation
  // treeBase!!.children.forEach(child => {
  //   animateTree(child);
  //   child.children.forEach(gchild => {
  //     // animateTree(gchild);
  //   })
  // })
  // console.log(controls)
}
animate();
responsive(camera);

// EVENT LISTENERS
window.addEventListener("resize", () => responsive(camera));
window.addEventListener("pointermove", (e) =>
  onPointerMove(e, camera, scene, mouse, raycaster)
);
window.addEventListener("click", (e) => onClickScene(e));
document.getElementById("animate")?.addEventListener("click", () => {
  const status = getAnimateStatus();
  setAnimate(!status)
  document.getElementById("animate")!!.innerText = status ? "Start" : "Stop";
});
document.getElementById("reset")?.addEventListener("click", () => {
  console.log(controls)
  removeTree(treeBase!!);
  treeBase = defaultTree();
  camera.position.set(INIT_CAM_X, INIT_CAM_Y, INIT_CAM_Z);
  controls.reset();
});
