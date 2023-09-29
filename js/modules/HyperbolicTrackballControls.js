// Should be plugged above TrackBallControls to make hyperbolic isometries

import { TrackballControls } from "./TrackballControls.js";

class HyperbolicTrackballControls extends TrackballControls {
  constructor(object, domElement) {
    super();

    if (domElement === undefined)
      console.warn(
        'HyperbolicTrackballControls: The second parameter "domElement" is now mandatory.'
      );
    if (domElement === document)
      console.error(
        'HyperbolicTrackballControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'
      );

    const scope = this;
    const STATE = {
      NONE: -1,
      MOVE: 0,
      TOUCH_MOVE: 1,
    };

    // API

    this.enabled = true;
    this.screen = { left: 0, top: 0, width: 0, height: 0 };
    this.moveSpeed = 1;
    this.noMove = false;
    this.keys = ["KeyA" /*A*/, "KeyS" /*S*/, "KeyD" /*D*/];
  }
}

export { HyperbolicTrackballControls };
