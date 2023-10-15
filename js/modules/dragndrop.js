function allowDrop(ev) {
  console.log("file in drop zone");
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dropHandler(ev) {
  console.log("Drop");
  ev.preventDefault();

  // Loop through the dropped items and log their data
  for (const item of ev.dataTransfer.items) {
    if (item.kind === "file") {
      console.log("you gave me a file");
      const f = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function (event) {
        console.log(event.target.result);
      };
      console.log("here are the cntents of the file\n");
      reader.readAsText(f);
    } else {
      console.log("don't know what to do with this");
    }
  }
}

document.getElementById("dropzone").ondrop = dropHandler;
document.getElementById("dropzone").ondragover = allowDrop;
