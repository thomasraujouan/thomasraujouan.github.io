import * as THREE from "three";
import { TrackballControls } from "../../modules/TrackballControls.js"; // controls the camera
import {
  loadOBJModel,
  setMaterial,
  setTexture,
} from "../../modules/loadObj.js";
import { lightScene } from "../../modules/lights.js";
import { makeCamera } from "../../modules/camera.js";
import { allVisible, numberPadSwitch } from "../../modules/keyboard.js";
import { onWindowResize } from "../../modules/window.js";
import { ColorManagement } from "../../modules/three.module.js";
import { initialPosition } from "../../modules/keyboard.js";

/* GUI */

/* SCENE, CAMERA, LIGHTS */
const scene = new THREE.Scene();
const camera = makeCamera(
  undefined,
  innerWidth / innerHeight,
  undefined,
  undefined,
  undefined,
  { x: 12, y: 0, z: 12 }
);
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
const obj = await loadOBJModel(
  "/assets/obj/dressed-catenoids/dressed-cat-1plane.obj"
);

/* MATERIALS, TEXTURES */
setMaterial(obj);
setTexture(obj);

/* SYMMETRIES, POSITIONING*/
const pieces = [];
obj.rotateZ(Math.PI / 2);
obj.rotateY(Math.PI);
// obj.rotateX(Math.PI);
const copy1 = obj.clone();
const copy2 = obj.clone();
const copy3 = obj.clone();
copy1.scale.y = -1;
copy3.scale.y = -1;
copy2.rotateX(Math.PI);
copy3.rotateX(Math.PI);
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
