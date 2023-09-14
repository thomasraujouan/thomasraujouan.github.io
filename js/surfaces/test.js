import * as THREE from "three";
import { TrackballControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/TrackballControls"; // controls the camera
import { loadObj } from "../modules/loadObj.js";

/* GUI */

/* OBJ LOADING */

// Load the texture image
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/assets/textures/chess-texture.svg"); // Replace with the path to your texture image

const pieces = [];

/* GEOMETRY, MATERIALS, MESH */

/* SCENE, CAMERA, LIGHTS */

const light = new THREE.DirectionalLight(0xffffff, 0.5);
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
const ambientLight = new THREE.AmbientLight(0xffffff); // Adjust the color as needed
light.position.set(0, 5, 5);
backLight.position.set(0, -5, -5);

const camera = new THREE.PerspectiveCamera(
  30,
  innerWidth / innerHeight,
  0.001,
  1000
);
camera.position.x = 3;
camera.position.y = 2;
camera.position.z = 3;
const initialTarget = {
  x: 0,
  y: 0,
  z: 0,
};
camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);

const scene = new THREE.Scene();
loadObj(scene, "/assets/obj/dressed-enneper-full.obj");

scene.background = new THREE.Color(0x000000);
scene.add(light);
scene.add(backLight);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* MOUSE */

const mouse = {
  x: undefined,
  y: undefined,
};

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (-event.clientY / innerHeight) * 2 + 1;
});

addEventListener("mousedown", (event) => {
  // console.log("mousedown");
});

let spaceKey = 0;
addEventListener("keydown", (event) => {
  if (event.key === " ") {
    spaceKey = (spaceKey + 1) % 3;
    if (spaceKey === 0) {
      pieces[0].visible = true;
      pieces[1].visible = true;
      pieces[2].visible = true;
    }
    if (spaceKey === 1) {
      pieces[0].visible = false;
      pieces[1].visible = false;
      pieces[2].visible = false;
    }
    if (spaceKey === 2) {
      pieces[0].visible = false;
      pieces[1].visible = true;
      pieces[2].visible = false;
    }
  }
});

const controls = new TrackballControls(camera, renderer.domElement);
controls.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;

/* ANIMATION */

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  frame += 0.01;
}

animate();
