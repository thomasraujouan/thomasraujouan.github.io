import * as THREE from "three";
import { TrackballControls } from "/js/modules/TrackballControls.js";
import { OBJLoader } from "./js/modules/OBJLoader.module.js";
import { Matrix4 } from "./js/modules/three.module.js";

THREE.Cache.enabled = true; // for text loading

let camera,
  hyperbolicCamera,
  scene,
  renderer,
  controls,
  hyperbolicControls,
  object,
  vertexShader;

// 1ST LOAD: obj

const loader = new OBJLoader();
loader.load(
  "/assets/obj/dressed-catenoids/h3/1end.obj",
  function (obj) {
    object = obj;
    console.log("OBJ model succesfully loaded.");
    fetchVertexShader("/glsl/hyperbolic-lambert-vertex.glsl");
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

  setTexture(object);
  lightScene(scene);

  scene.add(object);

  camera = createCamera();
  hyperbolicCamera = createCamera();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // EVENTS

  controls = createControls(camera);
  hyperbolicControls = createHyperbolicControls(hyperbolicCamera);
  window.addEventListener("resize", onWindowResize);
  // window.addEventListener("keydown", onWindowKeydown);
  // window.addEventListener("mousedown", onWindowMouseDown);
  // window.addEventListener("mousemove", onWindowMouseMove);
  // window.addEventListener("mouseup", onWindowMouseUp);

  render();
}

function buildCustomMaterial(vertexShader) {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  material.onBeforeCompile = function (shader) {
    // set uniforms
    shader.uniforms.time = { value: 0 };
    shader.uniforms.lorentzMatrix = { value: new Matrix4() };

    // write shaders
    shader.vertexShader = vertexShader;

    // // replace shader
    // shader.vertexShader = replaceVertexShader(shader.vertexShader);

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
  hyperbolicControls.update();
  render();
}

function render() {
  // update uniforms
  scene.traverse(function (child) {
    if (child.isMesh) {
      const shader = child.material.userData.shader;
      if (shader) {
        shader.uniforms.time.value = performance.now() / 1000;
        shader.uniforms.lorentzMatrix.value = lorentzBoostFromPosition(
          hyperbolicCamera.position
        );
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
  controls.keys = ["KeyA", "KeyS", "KeyD"];
  return controls;
}

function createHyperbolicControls(camera) {
  hyperbolicControls = new TrackballControls(camera, renderer.domElement);
  hyperbolicControls.noRotate = true;
  hyperbolicControls.noZoom = false;
  hyperbolicControls.noPan = false;
  hyperbolicControls.panSpeed = 0.5;
  hyperbolicControls.keys = ["KeyA", "KeyS", "KeyD"];
  return hyperbolicControls;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    27,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;
  return camera;
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

function lorentzBoostFromPosition(vec3) {
  const result = new Matrix4();
  result.multiply(makeSO3Matrix4(camera.matrixWorldInverse));
  result.multiply(xBoost(-vec3.x));
  result.multiply(yBoost(-vec3.y));
  result.multiply(makeSO3Matrix4(camera.matrixWorld));
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

function lightScene(scene) {
  const light = new THREE.AmbientLight(0xaaaaaa); // soft white light
  scene.add(light);

  // For Lambert-type materials:
  const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(0, 200, 0);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(100, 200, 100);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
  light3.position.set(-100, -200, -100);
  scene.add(light3);
}

function setTexture(
  object,
  texturePath = "/assets/textures/chess-texture.svg",
  flip = false
) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(texturePath, (texture) => {
    texture.flipY = flip;
  });
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.map = texture;
    }
  });
}
