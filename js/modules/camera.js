import { PerspectiveCamera } from "three";

const makeCamera = (
  fov = 30,
  aspect = 1,
  near = 0.001,
  far = 1000,
  initialTarget = { x: 0, y: 0, z: 0 }
) => {
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 3;
  camera.position.y = 2;
  camera.position.z = 3;
  camera.initialTarget = initialTarget;
  camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);
  return camera;
};

export { makeCamera };
