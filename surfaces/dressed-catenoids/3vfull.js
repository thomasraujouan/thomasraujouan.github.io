import * as THREE from "three";
import { TrackballControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/TrackballControls"; // controls the camera
import { OBJLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/OBJLoader";

/* GUI */

/* OBJ LOADING */

// instantiate a loader
const loaderCosta = new OBJLoader();

// load a resource
loaderCosta.load(
  // resource URL
  "/assets/dressed-catenoids/3vfull.obj",
  // called when resource is loaded
  function (object) {
    // Adjust the object's position to the center of the scene
    // const boundingBox = new THREE.Box3().setFromObject(object);
    // const center = boundingBox.getCenter(new THREE.Vector3());
    // object.position.sub(center);
    // Set the material.side property for each mesh in the object's children
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
      }
    });
    // add the model to the scene
    scene.add(object);
  },
  // called when loading is in progresses
  function (xhr) {
    // Compute the loading progression
    const load = xhr.loaded / xhr.total;
    const loadText = load * 100 + "% loaded";
    console.log(loadText);
    // Display the loading progression
    const info = document.getElementById("info");
    if (load != 1) {
      info.innerText = loadText;
    } else info.innerText = "";
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

/* GEOMETRY, MATERIALS, MESH */

/* ANIMATION */

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  frame += 0.01;
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
  console.log(controls);
});

/* SCENE, CAMERA, LIGHTS */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.001,
  1000
);
const light = new THREE.DirectionalLight(0xffffff, 0.5);
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
const ambientLight = new THREE.AmbientLight(0x404040); // Adjust the color as needed

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //Is it really less jagged?
document.body.appendChild(renderer.domElement);

const controls = new TrackballControls(camera, renderer.domElement);

const initialTarget = {
  x: 0,
  y: 0,
  z: 0,
};

controls.target.set(initialTarget.x, initialTarget.y, initialTarget.z);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;
// controls.minPolarAngle = -Infinity;
// controls.maxPolarAngle = +Infinity;

light.position.set(0, 10, 10);
backLight.position.set(0, 0, -10);

camera.position.x = 2.1231781962616725;
camera.position.y = -0.05663821112201709;
camera.position.z = 2.2765579681206227;

camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

scene.add(light);
scene.add(backLight);
scene.add(ambientLight);

animate();

console.log(loaderCosta);
