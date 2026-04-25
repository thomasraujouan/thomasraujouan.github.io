import { xlab } from "xlab";
import { obj_to_json } from "loaders";
import { run } from "./main.js";

// TODO: add possibility to upload multiple files

const surfacePaths = [];

const selectedFile = document.getElementById("input");
selectedFile.addEventListener("change", handleFiles);
function handleFiles() {
  const file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    const url = reader.result;
    surfacePaths.push(url);
    run(surfacePaths);
  };
  reader.readAsDataURL(file);
}
