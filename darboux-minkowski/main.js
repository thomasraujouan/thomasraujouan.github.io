import * as THREE from "three";
import  {Surface} from "./modules/Surface.js";
import { TrackballControls } from "./modules/TrackballControls.js"; // controls the camera
import {
  computeRadius,
  flipTexture,
  loadOBJModel,
  phongMaterial,
  setMaterial,
  setTexture,
} from "./modules/loadObj.js";
import { lightScene } from "./modules/lights.js";
import { fittingDistance, makeCamera } from "./modules/camera.js";
import { allVisible, numberPadSwitch } from "./modules/keyboard.js";
import { onWindowResize } from "./modules/window.js";
import { ColorManagement } from "./modules/three.module.js";
import { initialPosition } from "./modules/keyboard.js";

/* SCENE, LIGHTS */
const scene = new THREE.Scene();

scene.background = new THREE.Color("black");
lightScene(scene);

/* OBJ LOADING */
const obj = await loadOBJModel(
  "./dressed-lorentzian-catenoid.obj"
);

/* MATERIALS, TEXTURES */
setMaterial(obj, phongMaterial);

/* SYMMETRIES, POSITIONING*/
const pieces = [];
obj.rotateX(1*Math.PI / 2);
pieces.push(obj);
for (let index = 0; index < pieces.length; index++) {
  scene.add(pieces[index]);
}

/* LIGHT CONE */
const coneRadius = 2.3;
const geometry = new THREE.ConeGeometry(
  coneRadius, 
  coneRadius, 
  16, 
  1, 
  true); 
const wireframe = new THREE.WireframeGeometry( geometry );
const cone1 = new THREE.LineSegments( wireframe );
cone1.translateY(-0.5*coneRadius);
const cone2 = new THREE.LineSegments( wireframe );
cone2.translateY(0.5*coneRadius);
cone2.rotateX(Math.PI);
const cones = [cone1, cone2];
cones.forEach(cone => {
  cone.material.depthTest = true;
  cone.material.transparent = true;
  cone.material.opacity = 0.5;
  scene.add( cone )
});

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
  0.1,
  500,
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
