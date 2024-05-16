class Surface {
  constructor(pieces) {
    this.pieces = pieces;

    this.addToScene = function (scene) {
      for (let index = 0; index < pieces.length; index++) {
        scene.add(this.pieces[index]);
      }
    };

    this.makeCamera = function () {
      console.log("function Surface.makeCamera still has to be written");
    };
  }
}

export { Surface };
