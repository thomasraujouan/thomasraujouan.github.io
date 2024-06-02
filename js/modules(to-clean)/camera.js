import { PerspectiveCamera } from "three";

const makeCamera = (
  fov = 30,
  aspect = 1,
  near = 0.1,
  far = 500,
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

const fittingDistance = function (fov, objectRadius) {
  // https://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object/14614736#14614736
  const fovInDegrees = fov * (Math.PI / 180);
  const distance = Math.abs(objectRadius / Math.sin(fovInDegrees / 2));
  return distance;
};

export { makeCamera, fittingDistance };
