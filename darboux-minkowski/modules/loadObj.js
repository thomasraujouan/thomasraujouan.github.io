import { OBJLoader } from "./OBJLoader.module.js";
import * as THREE from "three";
// import { hyperbolicVertex } from "./read-vertex-shader.js/index.js";

const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x999999, // Set your desired color
  shininess: 10, // Set the shininess (adjust as needed)
  // map: texture,
});
const normalMaterial = new THREE.MeshNormalMaterial({
  color: 0x000000, // Set your desired color
  shininess: 10, // Set the shininess (adjust as needed)
  // map: texture,
});

var customUniforms = THREE.UniformsUtils.merge([
  THREE.ShaderLib.phong.uniforms,
  { hyperbolic_u: { value: 0.1 } },
]);

// var customMaterial2 = new THREE.MeshPhongMaterial({
//   color: 0xbbbbbb, // Set your desired color
//   shininess: 10, // Set the shininess (adjust as needed)
//   // map: texture,
// });

// customMaterial2.vertexShader = hyperbolicVertex;
// customMaterial2.uniforms = customUniforms;
// customMaterial2.name = "custom-material";

var hyperbolicMaterial = new THREE.MeshStandardMaterial({
  color: 0xbbbbbb, // Set your desired color
  shininess: 10, // Set the shininess (adjust as needed)
  name: "hyperbolicMaterial",
  // map: texture,
});

hyperbolicMaterial.userData.uniforms = {
  hyperbolic_u: { value: 1.0 },
};

// Usage: const obj = await loadOBJModel(objPath);
const loadOBJModel = async function (objPath) {
  const loader = new OBJLoader();
  try {
    const obj = await new Promise((resolve, reject) => {
      loader.load(
        objPath,
        (loadedObj) => {
          resolve(loadedObj); // Resolve the Promise with the loaded object
        },
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
        reject
      ); // Reject the Promise if there's an error
    });
    return obj; // Return the loaded object
  } catch (error) {
    throw new Error("Error loading OBJ model: " + error);
  }
};

const loadOBJString = async function (string) {
  const loader = new OBJLoader();
  try {
    const obj = await new Promise((resolve, reject) => {
      loader.load(
        objPath,
        (loadedObj) => {
          resolve(loadedObj); // Resolve the Promise with the loaded object
        },
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
        reject
      ); // Reject the Promise if there's an error
    });
    return obj; // Return the loaded object
  } catch (error) {
    throw new Error("Error loading OBJ model: " + error);
  }
};

const center = function (object) {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = boundingBox.getCenter(new THREE.Vector3());
  object.position.sub(center);
};

const computeRadius = function (object) {
  const box = new THREE.Box3();
  box.setFromObject(object);
  const min = Math.min(...box.min, ...box.max);
  const max = Math.max(...box.min, ...box.max);
  return Math.max(Math.abs(min), Math.abs(max));
};

const setMaterial = function (object, material = normalMaterial) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
    }
  });
};

const setHyperbolicMaterial = function (object, lorentzAngle) {
  setMaterial(object, hyperbolicMaterial);
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.onBeforeCompile = function (shader) {
        shader.uniforms.myUniform =
          child.material.userData.uniforms.hyperbolic_u;
        shader.vertexShader = hyperbolicVertex.text;
      };
    }
  });
};

const makeMaterialHyperbolic = function (object) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.onBeforeCompile = () => {};
    }
  });
};

const setTexture = function (
  object,
  texturePath = "./chess-texture.svg",
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
};

const flipTexture = function (object) {
  const textureLoader = new THREE.TextureLoader();
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh && child.material.map) {
      textureLoader.load("/assets/textures/chess-texture.svg", (texture) => {
        texture.flipY = true;
        const newMaterialMap = texture;
        const newMaterial = child.material.clone();
        newMaterial.map = newMaterialMap;
        child.material = newMaterial;
      });
    }
  });
};

export {
  loadOBJModel,
  center,
  phongMaterial,
  normalMaterial,
  setMaterial,
  setTexture,
  makeMaterialHyperbolic,
  setHyperbolicMaterial,
  flipTexture,
  computeRadius,
};
/*
Usage:
const scene = new THREE.Scene();
loadObj(scene, "/assets/obj/dressed-enneper-full.obj");
*/
