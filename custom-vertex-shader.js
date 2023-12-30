import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js";
import { OBJLoader } from "./js/modules/OBJLoader.module.js";

THREE.Cache.enabled = true; // for text loading

let camera, scene, renderer, controls, object, vertexShader;

// 1ST LOAD: obj

const loader = new OBJLoader();
loader.load(
  "/assets/obj/dressed-catenoids/h3/2v1.obj",
  function (obj) {
    object = obj;
    console.log("OBJ model succesfully loaded.");
    fetchVertexShader("/glsl/hyperbolic-vertex.glsl");
  },
  objLoadOnProgress,
  objLoadOnError
);

// 2ND LOAD: vertex shader

function fetchVertexShader(path) {
  const loader = new THREE.FileLoader();
  loader.load(
    // resource URL
    path,
    // onLoad callback
    function (data) {
      vertexShader = data;
      console.log("Vertex shader succesfully loaded.");
      main();
    },
    textLoadOnProgress(path),
    textLoadOnError(path)
  );
}

// MAIN

function main() {
  init();
  animate();
}

function init() {
  scene = new THREE.Scene();

  object.traverse(function (child) {
    if (child.isMesh) {
      child.material = buildCustomMaterial(vertexShader);
    }
  });

  object.position.y = -0.0;
  object.scale.setScalar(1.0);

  scene.add(object);

  createCamera();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS

  window.addEventListener("resize", onWindowResize);
  createControls(camera);

  render();
}

function buildCustomMaterial(vertexShader) {
  const material = new THREE.MeshNormalMaterial();
  material.onBeforeCompile = function (shader) {
    // set uniforms
    shader.uniforms.time = { value: 0 };
    shader.uniforms.lorentzX = { value: 1.0 };
    shader.uniforms.lorentzY = { value: 1.0 };
    shader.uniforms.lorentzZ = { value: 1.0 };

    // write shaders
    shader.vertexShader = vertexShader;

    material.userData.shader = shader;
    material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
  };
  return material;
}

//

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

//

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  // update uniforms
  scene.traverse(function (child) {
    if (child.isMesh) {
      const shader = child.material.userData.shader;

      if (shader) {
        shader.uniforms.time.value = performance.now() / 1000;
      }
    }
  });

  renderer.render(scene, camera);
}

function createControls(camera) {
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.keys = ["KeyA", "KeyS", "KeyD"];
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    27,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;
}

function objLoadOnProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log("OBJ model " + percentComplete.toFixed(2) + "% downloaded");
  }
}

function objLoadOnError() {}

function textLoadOnProgress(path) {
  return () => {
    console.log("Loading vertex shader at " + path);
  };
}

function textLoadOnError(path) {
  return () => {
    console.error("An error happened while loading the text shader at " + path);
  };
}
