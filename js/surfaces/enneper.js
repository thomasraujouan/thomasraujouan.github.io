import * as THREE from "three";
import { TrackballControls } from "https://unpkg.com/three@0.139.2/examples/jsm/controls/TrackballControls"; // controls the camera
import { OBJLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/OBJLoader";

/* GUI */

/* OBJ LOADING */

// instantiate a loader
const loaderCosta = new OBJLoader();

// Load the texture image
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/assets/textures/checker.jpg"); // Replace with the path to your texture image
const texture2 = textureLoader.load("/assets/textures/chess-texture2.png"); // Replace with the path to your texture image

const pieces = [];

// load a resource
loaderCosta.load(
  // resource URL
  "/assets/obj/dressed-enneper-full.obj",
  // called when resource is loaded
  function (object) {
    // Set the material.side property for each mesh in the object's children
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        // Create a Phong material for the mesh
        const material = new THREE.MeshPhongMaterial({
          color: 0x888888, // Set your desired color
          shininess: 50, // Set the shininess (adjust as needed)
          map: texture,
        });
        child.material = material; // Assign the material to the mesh
        child.castShadow = true; // Enable casting shadows for the mesh
        child.receiveShadow = true; // Enable receiving shadows for the mesh
        child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
      }
    });
    // object.rotateZ(Math.PI / 2);
    // const objectCopy1 = object.clone();
    // objectCopy1.scale.y = -1;
    // const objectCopy2 = object.clone();
    // objectCopy2.scale.z = -1;
    // const objectCopy3 = object.clone();
    // objectCopy3.scale.y = -1;
    // objectCopy3.scale.z = -1;

    // const objectCopy4 = objectCopy1.clone();
    // const objectCopy5 = objectCopy2.clone();
    // objectCopy3.scale.x = -1;

    // objectCopy4.scale.x = -1;
    // objectCopy5.scale.x = -1;

    // Rotate the copied object by a specific angle
    // objectCopy3.scale.y = -1;
    // objectCopy3.rotateX(Math.PI);

    // add the models to the scene
    scene.add(object);
    // scene.add(objectCopy1);
    // scene.add(objectCopy2);
    // scene.add(objectCopy3);
    // scene.add(objectCopy4);
    // scene.add(objectCopy5);
    // scene.add(objectCopy3);
    // Export the pieces for later use
    pieces.push(
      object
      // objectCopy1,
      // objectCopy2,
      // objectCopy3
      // objectCopy4,
      // objectCopy5
    );
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

const light = new THREE.DirectionalLight(0xffffff, 1);
const backLight = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff); // Adjust the color as needed
light.position.set(0, 5, 5);
backLight.position.set(0, -5, -5);

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.001,
  1000
);
camera.position.x = 12;
camera.position.y = 12;
camera.position.z = 12;
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
    spaceKey = (spaceKey + 1) % 4;
    if (spaceKey === 0) {
      pieces[0].visible = true;
      pieces[1].visible = true;
      pieces[2].visible = true;
      pieces[3].visible = true;
      pieces[4].visible = true;
      pieces[5].visible = true;
    }
    if (spaceKey === 1) {
      pieces[0].visible = true;
      pieces[1].visible = false;
      pieces[2].visible = false;
      pieces[3].visible = false;
      pieces[4].visible = false;
      pieces[5].visible = false;
    }
    if (spaceKey === 2) {
      pieces[0].visible = true;
      pieces[1].visible = true;
      pieces[2].visible = false;
      pieces[3].visible = false;
      pieces[4].visible = false;
      pieces[5].visible = false;
    }
    if (spaceKey === 3) {
      pieces[0].visible = true;
      pieces[1].visible = true;
      pieces[2].visible = true;
      pieces[3].visible = false;
      pieces[4].visible = false;
      pieces[5].visible = false;
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
