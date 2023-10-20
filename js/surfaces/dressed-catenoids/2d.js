import * as THREE from "three";
import { TrackballControls } from "../../modules/TrackballControls.js"; // controls the camera
import { fittingDistance, makeCamera } from "../../modules/camera.js";
import {
  allVisible,
  initialPosition,
  numberPadSwitch,
} from "../../modules/keyboard.js";
import { lightScene } from "../../modules/lights.js";
import {
  computeRadius,
  flipTexture,
  loadOBJModel,
  setMaterial,
  setTexture,
} from "../../modules/loadObj.js";
import { onWindowResize } from "../../modules/window.js";

/* SCENE, LIGHTS */
const scene = new THREE.Scene();

scene.background = new THREE.Color("white");
lightScene(scene);

/* OBJ LOADING */
const obj = await loadOBJModel("/assets/obj/dressed-catenoids/2d4th.obj");

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES, POSITIONING*/
const pieces = [];
obj.rotateZ(Math.PI / 2);
const copy1 = obj.clone();
const copy2 = obj.clone();
const copy3 = obj.clone();
copy1.scale.y = -1;
flipTexture(copy1);
copy3.scale.y = -1;
flipTexture(copy3);
copy2.rotateX(Math.PI);
copy3.rotateX(Math.PI);
pieces.push(obj);
pieces.push(copy1);
pieces.push(copy2);
pieces.push(copy3);
for (let index = 0; index < pieces.length; index++) {
  scene.add(pieces[index]);
}

/* CAMERA */
const fov = 30;
const radius = computeRadius(obj);
const distance = fittingDistance(fov, radius);
const position = {
  x: -Math.sqrt((2 * (distance * distance)) / 5),
  y: Math.sqrt((distance * distance) / 5),
  z: -Math.sqrt((2 * (distance * distance)) / 5),
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
