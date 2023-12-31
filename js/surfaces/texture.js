import * as THREE from "three";
import { TrackballControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/TrackballControls"; // controls the camera
import { OBJLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/OBJLoader";

/* GUI */

/* OBJ LOADING */

// instantiate a loader
const loaderCosta = new OBJLoader();

// Load the texture image
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/assets/chess-texture.svg"); // Replace with the path to your texture image

// load a resource
loaderCosta.load(
  // resource URL
  "/assets/output.obj",
  // called when resource is loaded
  function (object) {
    // Adjust the object's position to the center of the scene
    // const boundingBox = new THREE.Box3().setFromObject(object);
    // const center = boundingBox.getCenter(new THREE.Vector3());
    // object.position.sub(center);
    // Set the material.side property for each mesh in the object's children
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        // Create a Phong material for the mesh
        const material = new THREE.MeshPhongMaterial({
          color: 0xbbbbbb, // Set your desired color
          shininess: 10, // Set the shininess (adjust as needed)
          map: texture,
        });

        child.material = material; // Assign the material to the mesh
        child.castShadow = true; // Enable casting shadows for the mesh
        child.receiveShadow = true; // Enable receiving shadows for the mesh
        child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
      }
    });
    // add the model to the scene
    object.rotateZ(Math.PI / 2);
    scene.add(object);
    // Create a copy of the loaded object
    const objectCopy1 = object.clone();
    const objectCopy2 = object.clone();
    const objectCopy3 = object.clone();

    // Rotate the copied object by a specific angle (in radians)
    objectCopy1.rotateX(Math.PI);
    objectCopy2.rotateY(Math.PI);
    objectCopy3.rotateX(Math.PI);
    objectCopy3.rotateY(Math.PI);

    // Add the copied and rotated object to the scene
    scene.add(objectCopy1);
    scene.add(objectCopy2);
    scene.add(objectCopy3);
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

/* SCENE, CAMERA, LIGHTS */

const light = new THREE.DirectionalLight(0xffffff, 0.5);
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
const ambientLight = new THREE.AmbientLight(0xffffff); // Adjust the color as needed
light.position.set(0, 5, 5);
backLight.position.set(0, -5, -5);

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.001,
  1000
);
camera.position.x = 0;
camera.position.y = -0;
camera.position.z = 2;
const initialTarget = {
  x: 0,
  y: 0,
  z: 0,
};
camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.add(light);
scene.add(backLight);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
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
  console.log("mousedown");
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
