import { padicValuation } from "./maths.js";

const switchPieces = function (key, pieces) {
  console.log(0b11);
  return (event) => {
    if (event.key === key.content) {
      key.count = (key.count + 1) % 2;
      if (key.count === 0) {
        pieces[0].visible = true;
        pieces[1].visible = true;
      }
      if (key.count === 1) {
        pieces[0].visible = true;
        pieces[1].visible = false;
      }
    }
  };
};

const allVisible = function (pieces) {
  return (event) => {
    if (event.key === "a") {
      pieces.forEach((element) => {
        element.visible = true;
      });
    }
  };
};

const numberPadSwitch = function (pieces) {
  const keys = [];
  for (let index = 0; index < pieces.length; index++) {
    keys.push(index.toString());
  }
  return (event) => {
    if (keys.includes(event.key)) {
      pieces[parseInt(event.key)].visible =
        !pieces[parseInt(event.key)].visible;
    }
  };
};

export { switchPieces, numberPadSwitch, allVisible };
