import * as THREE from "./modules/three.module.js";
import { OBJLoader } from "./modules/OBJLoader.module.js";
import { TrackballControls } from "./modules/TrackballControls.js";

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
  const distance = 8.64; // cf fittingDistance()
  const position = {
    x: -Math.sqrt((2 * (distance * distance)) / 5),
    y: Math.sqrt((distance * distance) / 5),
    z: -Math.sqrt((2 * (distance * distance)) / 5),
  };
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 500);
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
    object.rotateX(Math.PI / 2);
    scene.add(object);
    animate();
  }

  // TEXTURE
  const textureLoader = new THREE.TextureLoader(manager);
  const texture = textureLoader.load("./checkerboard16.svg", render);

  // OBJ LOADER
  const loader = new OBJLoader(manager);
  loader.load("./dressed-lorentzian-catenoid.obj", function (obj) {
    object = obj;
  }, onProgress, onError);
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log('model ' + percentComplete.toFixed(2) + '% downloaded');
    }
  }
  function onError() { }

  // LIGHT CONE 
  const geometry = new THREE.ConeGeometry(
    radius,
    radius,
    16,
    1,
    true);
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    depthTest: true,
    transparent: true,
    opacity: 0.5
  });
  const wireframe = new THREE.WireframeGeometry(geometry);
  const cone1 = new THREE.LineSegments(wireframe, material);
  cone1.translateY(-0.5 * radius);
  const cone2 = new THREE.LineSegments(wireframe, material);
  cone2.translateY(0.5 * radius);
  cone2.rotateX(Math.PI);
  const cones = [cone1, cone2];
  cones.forEach(cone => {
    scene.add(cone)
  });

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

  // ANIMATION 
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    frame += 0.01;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function initialPosition(event) {
  if (event.key === " ") {
    camera.copy(initialCamera);
  }
}

function render() {
  renderer.render(scene, camera);
}