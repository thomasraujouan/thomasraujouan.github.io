const switchPieces = function (key, pieces) {
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

export { switchPieces };
