import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js"; // controls the camera
import { loadOBJModel, setMaterial, setTexture } from "/js/modules/loadObj.js";
import { lightScene } from "/js/modules/lights.js";
import { makeCamera } from "/js/modules/camera.js";
import { allVisible, numberPadSwitch } from "/js/modules/keyboard.js";
import { onWindowResize } from "/js/modules/window.js";

/* GUI */

/* SCENE, CAMERA, LIGHTS */
const scene = new THREE.Scene();
const camera = makeCamera(undefined, innerWidth / innerHeight);
scene.background = new THREE.Color("white");
lightScene(scene);

/* RENDERER, WINDOW */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize(camera, renderer), false);

/* OBJ LOADING */
const obj = await loadOBJModel("/assets/obj/dressed-catenoids/2v4th.obj");

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES */
const pieces = [];
obj.rotateZ(Math.PI / 2);
const copy1 = obj.clone();
const copy2 = obj.clone();
const copy3 = obj.clone();
copy1.rotateX(Math.PI);
copy2.rotateY(Math.PI);
copy3.rotateX(Math.PI);
copy3.rotateY(Math.PI);
pieces.push(obj);
pieces.push(copy1);
pieces.push(copy2);
pieces.push(copy3);
for (let index = 0; index < pieces.length; index++) {
  scene.add(pieces[index]);
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

/* MAIN */
animate();
