const dropzone = document.getElementById("dropzone");

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
      window.objFile = f;
      const reader = new FileReader();
      reader.onload = function (event) {
        window.objFile = event.target.result;
      };
      reader.readAsText(f);
      console.log("file saved in window.objFile\n");
    } else {
      console.log("don't know what to do with this");
    }
  }
}

dropzone.ondrop = dropHandler;
dropzone.ondragover = allowDrop;
dropzone.innerHTML = "Drop your obj file here.";
