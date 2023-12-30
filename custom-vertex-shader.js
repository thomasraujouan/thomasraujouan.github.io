import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js";
import { OBJLoader } from "./js/modules/OBJLoader.module.js";

THREE.Cache.enabled = true; // for text loading

let camera, scene, renderer, controls, object;

const loader = new OBJLoader();
loader.load(
  "/assets/obj/dressed-catenoids/h3/2v1.obj",
  function (obj) {
    bindMaterial(obj, "/glsl/example-vshader.glsl");
  },
  objOnProgress,
  objOnError
);

function init() {
  camera = new THREE.PerspectiveCamera(
    27,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  scene = new THREE.Scene();
  scene.add(object);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS

  window.addEventListener("resize", onWindowResize);
  createControls(camera);

  render();
}

function buildTwistMaterial(data) {
  // define material
  const material = new THREE.MeshNormalMaterial();
  material.onBeforeCompile = function (shader) {
    // set uniforms
    shader.uniforms.time = { value: 0 };

    // write shaders
    shader.vertexShader = data;

    material.userData.shader = shader;

    material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
    console.log(material);
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

function main(obj, data) {
  object = obj;
  obj.traverse(function (child) {
    if (child.isMesh) {
      child.material = buildTwistMaterial(data);
    }
  });

  obj.position.y = -0.0;
  obj.scale.setScalar(1.0);
  init();
  animate();
}

function bindMaterial(obj, path) {
  const shaderLoader = new THREE.FileLoader();

  shaderLoader.load(
    // resource URL
    path,
    // onLoad callback
    function (data) {
      // output the text to the console
      // console.log(data);
      // callback(data);
      main(obj, data);
    },
    // onProgress callback
    function (xhr) {
      console.log("Loading vertex shader at " + path);
    },
    // onError callback
    function (err) {
      console.error(
        "An error happened while load the vertex shader at " + path
      );
    }
  );
}

function objOnProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log("model " + percentComplete.toFixed(2) + "% downloaded");
  }
}

function objOnError() {}
