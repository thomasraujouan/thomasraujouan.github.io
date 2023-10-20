import * as THREE from "three";
import { TrackballControls } from "../../modules/TrackballControls.js"; // controls the camera
import {
  computeRadius,
  loadOBJModel,
  setMaterial,
  setTexture,
} from "../../modules/loadObj.js";
import { lightScene } from "../../modules/lights.js";
import { fittingDistance, makeCamera } from "../../modules/camera.js";
import { allVisible, numberPadSwitch } from "../../modules/keyboard.js";
import { onWindowResize } from "../../modules/window.js";
import { initialPosition } from "../../modules/keyboard.js";

/* SCENE, LIGHTS */
const scene = new THREE.Scene();
scene.background = new THREE.Color("white");
lightScene(scene);

/* OBJ LOADING */
const obj = await loadOBJModel("/assets/obj/dressed-catenoids/2v4th.obj");

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES */
const pieces = [];
obj.rotateZ(0);
obj.rotateX(Math.PI / 2);
obj.rotateY(Math.PI / 2);
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

/*CAMERA*/
const fov = 30;
const radius = computeRadius(obj);
const distance = fittingDistance(fov, radius);
const position = {
  x: -Math.sqrt((distance * distance) / 2),
  y: 0,
  z: -Math.sqrt((distance * distance) / 2),
};
const camera = makeCamera(
  fov,
  innerWidth / innerHeight,
  undefined,
  undefined,
  undefined,
  position
);
const initialCamera = camera.clone();

/* GUI */

/* RENDERER, WINDOW */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize(camera, renderer), false);

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
