import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js";
import { OBJLoader } from "./js/modules/OBJLoader.module.js";
import { Matrix4 } from "./js/modules/three.module.js";

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
  object.lorentzMatrix = new Matrix4();

  scene.add(object);

  createCamera();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS

  createControls(camera);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", changeLorentzAngle);
  window.addEventListener("mousedown", startPan);
  window.addEventListener("mousemove", onPan);
  window.addEventListener("mouseup", endPan);

  render();
}

function buildCustomMaterial(vertexShader) {
  const material = new THREE.MeshNormalMaterial();
  material.onBeforeCompile = function (shader) {
    // set uniforms
    shader.uniforms.time = { value: 0 };
    shader.uniforms.lorentzMatrix = { value: new Matrix4() };

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
        shader.uniforms.lorentzMatrix.value = object.lorentzMatrix;
      }
    }
  });

  renderer.render(scene, camera);
}

function createControls(camera) {
  controls = new TrackballControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.isPanning = false;
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 5;

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

function changeLorentzAngle(event) {
  if (event.type === "keydown") {
    object.lorentzMatrix.multiply(makeSO3Matrix4(camera.matrixWorldInverse));

    if (event.key === "ArrowRight") {
      object.lorentzMatrix.multiply(xBoost(0.1));
      console.log(object.up);
    }
    if (event.key === "ArrowLeft") {
      object.lorentzMatrix.multiply(xBoost(-0.1));
    }
    if (event.key === "ArrowUp") {
      object.lorentzMatrix.multiply(yBoost(0.1));
    }
    if (event.key === "ArrowDown") {
      object.lorentzMatrix.multiply(yBoost(-0.1));
    }
    object.lorentzMatrix.multiply(makeSO3Matrix4(camera.matrixWorld));
  }
}

function startPan(event) {
  if (event.type === "mousedown") {
    if (event.button === 2) {
      controls.isPanning = true;
    }
  }
}

function onPan(event) {
  if (controls.isPanning) {
    object.lorentzMatrix.multiply(makeSO3Matrix4(camera.matrixWorldInverse));
    object.lorentzMatrix.multiply(
      xBoost((controls.panSpeed * event.movementX) / renderer.domElement.width)
    );
    object.lorentzMatrix.multiply(
      yBoost(
        (-controls.panSpeed * event.movementY) / renderer.domElement.height
      )
    );
    object.lorentzMatrix.multiply(makeSO3Matrix4(camera.matrixWorld));
    render();
  }
}

function endPan(event) {
  controls.isPanning = false;
}

function xBoost(a) {
  const result = new Matrix4();
  result.set(
    Math.cosh(a),
    Math.sinh(a),
    0,
    0,
    Math.sinh(a),
    Math.cosh(a),
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );
  return result;
}
function yBoost(a) {
  const result = new Matrix4();
  result.set(
    Math.cosh(a),
    0,
    Math.sinh(a),
    0,
    //
    0,
    1,
    0,
    0,
    //
    Math.sinh(a),
    0,
    Math.cosh(a),
    0,
    //
    0,
    0,
    0,
    1
  );
  return result;
}

function makeSO3Matrix4(m) {
  const result = new Matrix4();
  const el = m.elements;
  result.set(
    1,
    0,
    0,
    0,
    0,
    el[0],
    el[1],
    el[2],
    0,
    el[4],
    el[5],
    el[6],
    0,
    el[8],
    el[9],
    el[10]
  );
  return result;
}
