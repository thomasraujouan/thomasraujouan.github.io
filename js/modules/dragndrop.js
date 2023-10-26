import { OBJLoader } from "./OBJLoader.module.js";

const dropzone = document.getElementById("dropzone");

function allowDrop(ev) {
  console.log("file in drop zone");
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function onLoadCallback(event) {
  const file = event.target.result;
  window.objFile = file;
  console.log("file saved in window.objFile\n");
  console.log("here is the file");
  console.log(file);
  const loader = new OBJLoader();
  const obj = new Promise((resolve, reject) => {
    loader.loadString(file);
  });
  console.log(resolve(obj));
}

function dropHandler(ev) {
  console.log("Drop");
  ev.preventDefault();
  // Loop through the dropped items and log their data
  for (const item of ev.dataTransfer.items) {
    if (item.kind === "file") {
      console.log("you gave me a file");
      const f = item.getAsFile();
      window.objFile = f;
      const reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsText(f);
    } else {
      console.log("don't know what to do with this");
    }
  }
}

dropzone.ondrop = dropHandler;
dropzone.ondragover = allowDrop;
dropzone.innerHTML = "Drop your obj file here.";
