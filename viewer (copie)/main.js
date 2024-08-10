"use strict";
import { m4 } from "./m4.js";
import { degToRad } from "./math.js";
import { loadText } from "./loadText.js";
import { Obj } from "./Obj.js";

// Containers for the data to be loaded in
const shaders = [null, null];
const model = new Obj();

Promise.all([// wait for all promises to be resolved
  loadText('vshader.glsl', (text) => { shaders[0] = text; }),
  loadText('fshader.glsl', (text) => { shaders[1] = text; }),
  loadText(objPath, (text) => { model.parseObj(text); })
  // loadText('lawson-xi22.npy.obj', (text) => { model.parseObj(text); })
  // loadText('catenoid.obj', (text) => {model.parseObj(text);})
  // loadText('costa.obj', (text) => { model.parseObj(text); })
  // loadText('F.obj', (text) => { model.parseObj(text); })
  // loadText('cube.obj', (text) => { model.parseObj(text); })
  //loadText('e3-2v.obj', (text) => { model.parseObj(text); })
])
  .then(main);

/**
 * main() should be called after having loaded the external data
 * (shaders, obj file, ...)
 * and does the following, in order:
 * 
 * 1- Initiate a WebGL context, 
 * feed a program with shaders 
 * 
 * 2- Do some pre-processing (ant-stereographic projection)
 * and feed the buffers.
 * 
 * 3- Initialize a camera and a mouse, 
 * and create event listeners for interactivity
 * 
 * 4- Draw the scene
 * @returns nothing
 */
function main() {
  /* WEBGL */

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  // Use webglUtils to compile the shaders and link into a program
  // shaders is a global variable
  var program = webglUtils.createProgramFromSources(gl, shaders);

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  /* PRE-PROCESSING */

  const dressedCatenoidSymmetries = [ // reconstruct the surface by symmetries
    m4.scale(m4.identity, 1, -1, 1),
    m4.scale(m4.identity, -1, 1, 1),
    m4.scale(m4.identity, -1, -1, 1)
  ]
  model.matrices = [
    m4.identity,
    //...dressedCatenoidSymmetries
  ]
  model.computeNormalBuffer(); // face-normals in R^3
  model.toS3(); // anti-stereographic projection of vertices
  model.computeVertexBuffer(); // each vertex has now 4 components


  /* POSITION ATTRIBUTE */

  // Look up attribute location
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // Create a buffer
  var positionBuffer = gl.createBuffer();
  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Fill the current ARRAY_BUFFER buffer
  // with the values from the model (which is a global variable)
  gl.bufferData(gl.ARRAY_BUFFER, model.vertexBuffer, gl.STATIC_DRAW);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    positionAttributeLocation, // where to put the data
    4, // 4 components per iteration
    gl.FLOAT, // the data is 32bit floats
    false, // don't normalize the data
    0, // 0 = move forward size * sizeof(type) each iteration to get the next position
    0 // start at the beginning of the buffer
  );

  /* NORMAL ATTRIBUTE */

  var normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  var normalBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, model.normalBuffer, gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Look up uniform locations
  var viewMatrixInvTranspULocation = gl.getUniformLocation(program, "u_viewinvtrans");
  var viewProjectionUnifLocation = gl.getUniformLocation(program, "u_vpMatrix");
  var modelMatrixUniformLocation = gl.getUniformLocation(program, "u_modelMatrix");
  var moebiusMatrixUniformLocation = gl.getUniformLocation(program, "u_moebius");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  var lightDirectionUniformLocation = gl.getUniformLocation(program, "u_lightDirection");

  // MOUSE
  const mouse = {
    leftButton: { isDown: false },
    middleButton: { isDown: false },
    rightButton: { isDown: false },
    position: [0, 0],
    wheel: 0
  };

  // CAMERA
  const camera = {
    fov: degToRad(60),
    distanceToOrigin: (typeof distanceToOrigin === 'undefined') ? 1 : distanceToOrigin, //TODO: magic number (500 for F)
    aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
    zNear: 0.01,
    zFar: 2000,
    translation: [0, 0],
    matrix: m4.identity,
    // rotationMatrix: m4.identity,
    // rotationMatrix: initialCamera,
    // rotationMatrix: initialCamera,
    moebiusMatrix: m4.identity,
    // For Euclidean translation: (should be called screen translate?)
    translate: function (dx, dy, speed) {
      this.translation[0] += speed * dx;
      this.translation[1] += speed * dy;
    },
    moebiusMove: function (dx, dy, speed) {
      this.moebiusMatrix = m4.multiply(m4.inverse(this.rotationMatrix), this.moebiusMatrix);
      this.moebiusMatrix = m4.multiply(m4.moebiusFromMouse(dx, -dy, speed), this.moebiusMatrix);
      this.moebiusMatrix = m4.multiply(this.rotationMatrix, this.moebiusMatrix);
    },
    rotate: function (dx, dy, speed) {
      this.rotationMatrix = m4.multiply(this.rotationMatrix, m4.rotationFromMouse(dx, -dy, speed));
    },
    updateMatrix: function () {
      this.matrix = m4.identity;
      this.matrix = m4.multiply(this.matrix, this.rotationMatrix);
      this.matrix = m4.translate(this.matrix, 0, 0, this.distanceToOrigin);
    }
  };
  if (typeof initialCamera !== 'undefined') {
    camera.rotationMatrix = initialCamera;
  } else {
    camera.rotationMatrix = m4.identity;
  }

  /* EVENTS */
  window.addEventListener('resize', onWindowResize);
  document.addEventListener("contextmenu", (e) => { e.preventDefault() });
  document.addEventListener("mousedown", mouseDownHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("mouseup", mouseUpHandler, false);
  document.addEventListener("wheel", wheelHandler, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    drawScene()
  }
  function mouseMoveHandler(event) {
    const xNew = event.clientX;
    const yNew = event.clientY;
    const dx = xNew - mouse.position[0];
    const dy = yNew - mouse.position[1];
    if (mouse.rightButton.isDown) {
      // Euclidean translation:
      // camera.translate(dx, -dy, 1);//TODO: magic number
      // Moebius transfomration:
      camera.moebiusMove(dx, dy, 0.003 * Math.exp(-mouse.wheel / 1000000));//TODO: magic number
    }
    if (mouse.leftButton.isDown) {
      //TODO: fix magic numbers
      camera.rotate(dx, dy, 0.007 * Math.exp(-mouse.wheel / 1000000));//TODO: magic number
    }
    drawScene();
    mouse.position = [xNew, yNew];
  }
  function mouseDownHandler(event) {
    if (event.button == 0) {
      mouse.leftButton.isDown = true;
    }
    if (event.button == 1) {
      mouse.middleButton.isDown = true
    }
    if (event.button == 2) {
      mouse.rightButton.isDown = true;
    }
    mouse.position = [event.clientX, event.clientY];
  }
  function mouseUpHandler(event) {
    if (event.button == 0) {
      mouse.leftButton.isDown = false;
    }
    if (event.button == 1) {
      mouse.middleButton.isDown = false;
    }
    if (event.button == 2) {
      mouse.rightButton.isDown = false;
    }
  }
  function wheelHandler(event) {
    const dy = event.deltaY;
    mouse.wheel += dy;
    const factor = Math.exp(-dy * 0.0002);//TODO: magic number
    camera.distanceToOrigin = camera.distanceToOrigin * factor;
    drawScene()
  }
  drawScene();
  /**
   * Draw the scene.
   * 
   * 1- Check the canvas size
   * 
   * 2- Tune the WebGL context (size, color, program to use...)
   * 
   * 3- Compute the various matrices
   * 
   * 4- Iterate on each copy of the model to draw
   */
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);
    // tell webgl to cull faces
    // gl.enable(gl.CULL_FACE);
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Compute the projection matrix
    var projectionMatrix = m4.perspective(camera.fov, camera.aspect, camera.zNear, camera.zFar);
    projectionMatrix = m4.translate(projectionMatrix, camera.translation[0], camera.translation[1], 0);

    // Update the camera matrix
    camera.updateMatrix();

    // Compute a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(camera.matrix);
    // This is needed for the normals
    var viewMatrixInvTranspose = m4.inverse(m4.transpose(viewMatrix))

    // Compute the viewProjection matrix. The MVP matrix is computed by the vertex shader
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // The light comes from the camera:
    const lightDirection = [0, 0, -1];

    // Draw each copy of the model
    model.matrices.forEach(modelMatrix => {
      // Set the uniforms.
      gl.uniformMatrix4fv(modelMatrixUniformLocation, false, modelMatrix);
      gl.uniformMatrix4fv(moebiusMatrixUniformLocation, false, (camera.moebiusMatrix));
      gl.uniformMatrix4fv(viewMatrixInvTranspULocation, false, viewMatrixInvTranspose);
      gl.uniformMatrix4fv(viewProjectionUnifLocation, false, viewProjectionMatrix);
      gl.uniform4fv(colorUniformLocation, [3 / 255, 0, 173 / 255, 1]); // de stijl blue
      gl.uniform3fv(lightDirectionUniformLocation, m4.normalize(lightDirection));
      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 3 * model.faces.length;
      gl.drawArrays(primitiveType, offset, count);
    });
  }
}
