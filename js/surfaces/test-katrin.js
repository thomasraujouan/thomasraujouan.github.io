import * as THREE from "three";
import { TrackballControls } from "../modules/TrackballControls.js"; // controls the camera
import { loadOBJModel, setMaterial, setTexture } from "../modules/loadObj.js";
import { lightScene } from "../modules/lights.js";
import { makeCamera } from "../modules/camera.js";
import { onWindowResize } from "../modules/window.js";
import { initialPosition } from "../modules/keyboard.js";

/* GUI */

/* SCENE, CAMERA, LIGHTS */
const scene = new THREE.Scene();
const camera = makeCamera(undefined, innerWidth / innerHeight);
const initialCamera = camera.clone();
scene.background = new THREE.Color("white");
lightScene(scene);

/* RENDERER, WINDOW */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize(camera, renderer), false);

/* OBJ LOADING */
const obj = await loadOBJModel("/assets/obj/costa.obj");

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES */
scene.add(obj);

/* MOUSE */
const controls = new TrackballControls(camera, renderer.domElement);
const initialTarget = camera.initialTarget;
controls.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;

/* KEYBOARD */
addEventListener("keydown", initialPosition(camera, initialCamera));

/* ANIMATION */
let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  frame += 0.01;
}

/* MAIN */
animate();
