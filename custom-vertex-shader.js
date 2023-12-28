import * as THREE from "three";

let camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    27,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 20;

  scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh = new THREE.Mesh(geometry, buildTwistMaterial(2.0));
  mesh.position.x = -0;
  mesh.position.y = -0.0;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  // EVENTS

  window.addEventListener("resize", onWindowResize);
}

function buildTwistMaterial(amount) {
  const material = new THREE.MeshNormalMaterial();
  material.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: 0 };

    shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      [
        `float theta = sin( time + position.y ) / ${amount.toFixed(1)};`,
        "float c = cos( theta );",
        "float s = sin( theta );",
        "mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );",
        "vec3 transformed = vec3( position ) * m;",
        "vNormal = vNormal * m;",
      ].join("\n")
    );

    material.userData.shader = shader;
  };

  // Make sure WebGLRenderer doesnt reuse a single program

  material.customProgramCacheKey = function () {
    return amount.toFixed(1);
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
