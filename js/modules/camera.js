import { PerspectiveCamera } from "three";

const makeCamera = (
  fov = 30,
  aspect = 1,
  near = 0.001,
  far = 1000,
  initialTarget = { x: 0, y: 0, z: 0 },
  position = { x: 3, y: 2, z: 3 }
) => {
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  camera.initialTarget = initialTarget;
  camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);
  return camera;
};

export { makeCamera };
