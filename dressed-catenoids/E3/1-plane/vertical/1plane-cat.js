import * as THREE from "/js/three.module.js";
import { OBJLoader } from "/js/OBJLoader.module.js";
import { TrackballControls } from "/js/TrackballControls.js";

const objPath = "./dressed-cat-1plane.obj";
const texturePath = "./texture.svg";

let object, camera, initialCamera, scene, renderer;

init();

function init() {
  // SCENE, LIGHTS
  scene = new THREE.Scene();
  scene.background = new THREE.Color("white");
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.5);

  // CAMERA
  const fov = 30;
  const radius = 2.2384183406829834; // cf computeRadius()
  const distance = 25; // cf fittingDistance()
  const position = {
    x: -Math.sqrt((2 * (distance * distance)) / 5),
    y: Math.sqrt((distance * distance) / 5),
    z: -Math.sqrt((2 * (distance * distance)) / 5),
  };
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  camera.lookAt(0, 0, 0);
  initialCamera = camera.clone();
  camera.add(pointLight);
  scene.add(camera);

  // MODEL LOADER MANAGER
  const manager = new THREE.LoadingManager(loadModel);
  function loadModel() {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0xbbbbbb, // Set your desired color
          shininess: 15, // Set the shininess (adjust as needed)
          map: texture,
        });
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
      }
    });
    // POSITIONING
    const pieces = [];
    object.rotateY((1 * Math.PI) / 8);
    object.rotateX((-0 * Math.PI) / 16);
    object.rotateZ((0 * Math.PI) / 2);
    const copy1 = object.clone();
    const copy2 = object.clone();
    const copy3 = object.clone();
    copy1.scale.y = -1;
    copy3.scale.y = -1;
    copy2.rotateX(Math.PI);
    copy3.rotateX(Math.PI);
    pieces.push(object);
    pieces.push(copy1);
    pieces.push(copy2);
    pieces.push(copy3);
    for (let index = 0; index < pieces.length; index++) {
      scene.add(pieces[index]);
    }
    animate();
  }

  // TEXTURE
  const textureLoader = new THREE.TextureLoader(manager);
  const texture = textureLoader.load(texturePath, render);
  texture.anisotropy = 4

  // OBJ LOADER
  const loader = new OBJLoader(manager);
  loader.load(objPath, onLoad, onProgress, onError);
  function onLoad(obj) {
    object = obj;
  }
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log('model ' + percentComplete.toFixed(2) + '% downloaded');
    }
  }
  function onError() { }

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // WINDOW
  window.addEventListener('resize', onWindowResize);

  // CONTROLS
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.5;

  // KEYBOARD
  addEventListener("keydown", initialPosition);
  addEventListener("keydown", numberPadSwitch(scene));
  addEventListener("keydown", allVisible(scene));

  // ANIMATION 
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    frame += 0.01;
  }
}

// EVENT LISTENERS CALLBACKS
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function initialPosition(event) {
  if (event.key === " ") {
    camera.copy(initialCamera);
    const p = getPieces(scene);
    p[2].visible = !p[2].visible;
  };
};
function numberPadSwitch(scene) {
  return (event) => {
    var temp = getPieces(scene);
    const keys = [];
    for (let index = 0; index < temp.length; index++) {
      keys.push((index + 1).toString());
    }
    if (keys.includes(event.key)) {
      temp[parseInt(event.key) - 1].visible =
      !temp[parseInt(event.key) - 1].visible;
    }
  };
};
function allVisible(scene) {
  return (event) => {
    if (event.key === "0") {
      var temp = getPieces(scene);
      for (let index = 0; index < temp.length; index++) {
        temp[index].visible = true;
      };
      
    }
  }
};
function getPieces(scene) {
  const result = [];
  scene.traverse(function (child) {
    if (child.isMesh) {
      result.push(child);
    }
  });
  return result;
};

// RENDERING
function render() {
  renderer.render(scene, camera);
}