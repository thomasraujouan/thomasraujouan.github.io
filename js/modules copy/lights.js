import * as THREE from "three";

const makeLights = (
  position = [0, 5, 5],
  color = 0xffffff,
  intensity = 0.5
) => {
  const defaultLights = {
    front: new THREE.DirectionalLight(color, intensity),
    back: new THREE.DirectionalLight(color, intensity),
    ambient: new THREE.AmbientLight(color),
  };
  defaultLights.front.position.set(...position);
  const backPosition = [-position[0], -position[1], -position[2]];
  defaultLights.back.position.set(...backPosition);
  return defaultLights;
};

const lightScene = (scene, lights = makeLights()) => {
  scene.add(lights.front);
  scene.add(lights.back);
  scene.add(lights.ambient);
  return null;
};

export { lightScene };
