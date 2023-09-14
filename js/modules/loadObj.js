import { OBJLoader } from "https://unpkg.com/three@0.139.2/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

const defaultMaterial = new THREE.MeshPhongMaterial({
  color: 0xbbbbbb, // Set your desired color
  shininess: 10, // Set the shininess (adjust as needed)
  // map: texture,
});

const loadObj = (
  scene,
  filePath,
  material = defaultMaterial,
  nbCopies = 1,
  centering = false
) => {
  const loader = new OBJLoader();
  loader.load(
    filePath,
    // called when resource is loaded
    function (object) {
      if (centering) {
        // TODO: centerObject(object)
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        object.position.sub(center);
      }
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.DoubleSide; // (or THREE.FrontSide) no face culling
        }
      });
      // Create copies of the loaded object
      // for (let index = 0; index < objectsArray.length; index++) {
      //   pieces.push(object.clone);
      // }
      scene.add(object);
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
  return null;
};

export { loadObj };
