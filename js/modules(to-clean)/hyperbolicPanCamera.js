// To replace this.panCamera in TrackballControls if the surface is in hyperbolic space

const hyperbolicPanCamera = (function () {
  const mouseChange = new Vector2(),
    objectUp = new Vector3(),
    pan = new Vector3();

  return function panCamera() {
    mouseChange.copy(_panEnd).sub(_panStart);

    if (mouseChange.lengthSq()) {
      if (scope.object.isOrthographicCamera) {
        const scale_x =
          (scope.object.right - scope.object.left) /
          scope.object.zoom /
          scope.domElement.clientWidth;
        const scale_y =
          (scope.object.top - scope.object.bottom) /
          scope.object.zoom /
          scope.domElement.clientWidth;

        mouseChange.x *= scale_x;
        mouseChange.y *= scale_y;
      }

      mouseChange.multiplyScalar(_eye.length() * scope.panSpeed);

      pan.copy(_eye).cross(scope.object.up).setLength(mouseChange.x);
      pan.add(objectUp.copy(scope.object.up).setLength(mouseChange.y));

      scope.object.position.add(pan); // Change here
      scope.target.add(pan);

      if (scope.staticMoving) {
        _panStart.copy(_panEnd);
      } else {
        _panStart.add(
          mouseChange
            .subVectors(_panEnd, _panStart)
            .multiplyScalar(scope.dynamicDampingFactor)
        );
      }
    }
  };
})();

export { hyperbolicPanCamera };
