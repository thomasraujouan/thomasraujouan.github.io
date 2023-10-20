import { OBJLoader } from "./OBJLoader.module.js";
import * as THREE from "three";
import { hyperbolic_vertex } from "../shaders/hyperbolic_vertex.js";

const defaultMaterial = new THREE.MeshPhongMaterial({
  color: 0xbbbbbb, // Set your desired color
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

// customMaterial2.vertexShader = hyperbolic_vertex;
// customMaterial2.uniforms = customUniforms;
// customMaterial2.name = "custom-material";

var hyperbolicMaterial = new THREE.MeshPhongMaterial({
  color: 0xbbbbbb, // Set your desired color
  shininess: 10, // Set the shininess (adjust as needed)
  name: "hyperbolicMaterial",
  // map: texture,
});

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

const setMaterial = function (object, material = defaultMaterial) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
    }
  });
};

const setHyperbolicMaterial = function (object) {
  setMaterial(object);
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.onBeforeCompile = function (shader) {
        shader.uniforms.myUniform = 1;
        shader.vertexShader = hyperbolic_vertex;
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
};

const flipTexture = function (object) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      const newMaterialMap = child.material.map.clone();
      newMaterialMap.flipY = true;
      const newMaterial = child.material.clone();
      newMaterial.map = newMaterialMap;
      child.material = newMaterial;
    }
  });
};

export {
  loadOBJModel,
  center,
  defaultMaterial,
  setMaterial,
  setTexture,
  makeMaterialHyperbolic,
  setHyperbolicMaterial,
  flipTexture,
};
/*
Usage:
const scene = new THREE.Scene();
loadObj(scene, "/assets/obj/dressed-enneper-full.obj");
*/
