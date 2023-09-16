import * as THREE from "three";
import { TrackballControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/TrackballControls"; // controls the camera
import { loadOBJModel, setMaterial, setTexture } from "../modules/loadObj.js";
import { lightScene } from "../modules/lights.js";
import { makeCamera } from "../modules/camera.js";
import { allVisible, numberPadSwitch } from "../modules/keyboard.js";

/* GUI */

/* OBJ LOADING */
const obj = await loadOBJModel("/assets/obj/dressed-helicoid-half.obj");

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES */
const pieces = [];
obj.rotateZ(Math.PI / 2);
obj.rotateY(Math.PI / 6);
pieces.push(obj);

/* SCENE, CAMERA*/
const scene = new THREE.Scene();
const camera = makeCamera(undefined, innerWidth / innerHeight);
scene.background = new THREE.Color(0xffffff);
for (let index = 0; index < pieces.length; index++) {
  scene.add(pieces[index]);
}

/* LIGHTS */
lightScene(scene);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);

/* WINDOW */
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* MOUSE */
const controls = new TrackballControls(camera, renderer.domElement);
const initialTarget = camera.initialTarget;
controls.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;

/* KEYBOARD */
addEventListener("keydown", numberPadSwitch(pieces));
addEventListener("keydown", allVisible(pieces));

/* ANIMATION */
let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  frame += 0.01;
}

animate();
