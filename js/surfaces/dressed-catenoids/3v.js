import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js"; // controls the camera
import { loadOBJModel, setMaterial, setTexture } from "/js/modules/loadObj.js";
import { lightScene } from "/js/modules/lights.js";
import { allVisible, numberPadSwitch } from "/js/modules/keyboard.js";
import { onWindowResize } from "/js/modules/window.js";
import { initialPosition } from "/js/modules/keyboard.js";

/* GUI */

/* SCENE, CAMERA, LIGHTS */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  30,
  innerWidth / innerHeight,
  0.001,
  1000
);
camera.translateX(4);
camera.translateY(2);
camera.translateZ(4);
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
const obj = await loadOBJModel("/assets/obj/dressed-catenoids/3v6th.obj");
/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES */
const pieces = [];
for (let k = 0; k < 6; k++) {
  pieces.push(obj.clone());
}
for (let index = 0; index < pieces.length; index++) {
  pieces[index].rotateZ(Math.PI / 2);
}
pieces[1].rotateX((2 * Math.PI) / 3);
pieces[2].rotateX((4 * Math.PI) / 3);
pieces[3].scale.x = -1;
pieces[4].rotateX((2 * Math.PI) / 3);
pieces[4].scale.x = -1;
pieces[5].rotateX((4 * Math.PI) / 3);
pieces[5].scale.x = -1;
for (let index = 0; index < pieces.length; index++) {
  scene.add(pieces[index]);
}

/* MOUSE */
const controls = new TrackballControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;

/* KEYBOARD */
addEventListener("keydown", numberPadSwitch(pieces));
addEventListener("keydown", allVisible(pieces));
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
