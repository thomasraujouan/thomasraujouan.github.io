import { xwebgl } from "xwebgl";
import { make_color, load_file, obj_to_json, make_box, make_element, make_spaceform, make_transform, make_vertex } from "loaders";

//jshint unused:false
var xlab = {};
/*global
  xlab
*/
xlab.util = {};

xlab.util.flatten = function (_) {
  'use strict';
  return [].concat.apply([], _);
};

/*
xlab.util.spaceform_signature = function(spaceform) {
  'use strict';
  var s = 0;
  switch (spaceform.geometry) {
  case 'euclidean':
    s = 0;
    break;
  case 'spherical':
    s = 1;
    break;
  case 'hyperbolic':
    s = -1;
    break;
  default:
    throw Error('unknown spaceform ' + spaceform.geometry);
  }
  return s;
};
*/

/*
xlab.util.hsv_to_rgb = function(h, s, v) {
  'use strict';
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
  case 0:
    r = v, g = t, b = p;
    break;
  case 1:
    r = q, g = v, b = p;
    break;
  case 2:
    r = p, g = v, b = t;
    break;
  case 3:
    r = p, g = q, b = v;
    break;
  case 4:
    r = t, g = p, b = v;
    break;
  case 5:
    r = v, g = p, b = q;
    break;
  }
  //return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 1.0 ];
  return [r, g, b, 1.0];
};
*/

xlab.util.hls_to_rgb = function (color) {
  'use strict';

  function _v(m1, m2, hue) {
    hue = hue % 1.0;
    if (hue < (1.0 / 6.0)) {
      return m1 + (m2 - m1) * hue * 6.0;
    }
    if (hue < 0.5) {
      return m2;
    }
    if (hue < (2.0 / 3.0)) {
      return m1 + (m2 - m1) * ((2.0 / 3.0) - hue) * 6.0;
    }
    return m1;
  }

  var h = color[0];
  var l = color[1];
  var s = color[2];

  var m2;
  if (s === 0.0) {
    return [l, l, l, 1.0];
  }
  if (l <= 0.5) {
    m2 = l * (1.0 + s);
  }
  else {
    m2 = l + s - (l * s);
  }
  var m1 = 2.0 * l - m2;
  return [_v(m1, m2, h + (1.0 / 3.0)), _v(m1, m2, h), _v(m1, m2, h - (1.0 / 3.0)), 1.0];
};

xlab.util.rgb_to_hls = function (color) {
  'use strict';

  var r = color[0];
  var g = color[1];
  var b = color[2];

  var maxc = Math.max(r, g, b);
  var minc = Math.min(r, g, b);

  var l = (minc + maxc) / 2.0;
  if (minc === maxc) {
    return [0.0, l, 0.0, 1.0];
  }
  var s;
  if (l <= 0.5) {
    s = (maxc - minc) / (maxc + minc);
  }
  else {
    s = (maxc - minc) / (2.0 - maxc - minc);
  }
  var rc = (maxc - r) / (maxc - minc);
  var gc = (maxc - g) / (maxc - minc);
  var bc = (maxc - b) / (maxc - minc);
  var h;
  if (r === maxc) {
    h = bc - gc;
  }
  else if (g === maxc) {
    h = 2.0 + rc - bc;
  }
  else {
    h = 4.0 + gc - rc;
  }
  h = (h / 6.0) % 1.0;
  return [h, l, s, 1.0];
};
/*global
  xlab
*/

xlab.math = {};

xlab.math.sign = function (x) {
  'use strict';
  return x > 0 ? 1 : (x < 0 ? -1 : 0);
};

xlab.math.normalize2 = function (x) {
  'use strict';
  var t = Math.sqrt(x[0] * x[0] + x[1] * x[1]);
  return [x[0] / t, x[1] / t];
};

xlab.math.normalize3 = function (x) {
  'use strict';
  var t = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
  return [x[0] / t, x[1] / t, x[2] / t];
};
/*global
  xlab
*/

xlab.Key = function (element, callback) {
  'use strict';

  function on_key(event) {
    event.preventDefault();
    event.stopPropagation();
    if (callback.hasOwnProperty('' + event.which)) {
      callback['' + event.which]();
    }
    // return false to prevent other key handlers
    return false;
  }

  // give the document keyboard focus
  //element.setAttribute('tabindex','0');
  //element.focus();
  document.addEventListener('keydown', on_key);

  return {};
};
/*global
  xlab
*/

//---------------------------------------------
// MouseFilter
//---------------------------------------------
xlab.MouseFilter = function () {
  'use strict';

  var client;

  // jshint unused:false

  function new_data() {
    return {
      type: null,
      time: 0,
      dtime: 0,
      buttons: [],
      button: 0,
      position: [0, 0],
      dposition: [0, 0]
    };
  }

  var data_stack = [new_data(), new_data()];
  function data() { return data_stack[1]; }

  function update(type, event, data) {
    // create a new event
    var time = Date.now();
    var d = {
      type: type,
      time: time,
      dtime: time - data.time,
      button: data.buttons[data.buttons.length - 1],
      buttons: data.buttons,
      position: [event.clientX, event.clientY],
      dposition: [
        event.clientX - data.position[0], event.clientY - data.position[1]
      ]
    };
    // push the new event into the stack
    data_stack = [data_stack[1], d];
  }

  function on_mouse_down(event) {
    // return if button is not one of [0, 1, 2]
    if (event.button < 0 || event.button > 2) {
      return;
    }
    // return if event.button is already in button stack
    if (data().buttons.indexOf(event.button) !== -1) {
      return;
    }
    // insert the button into the button stack
    data().buttons.push(event.button);
    // update and fire the mouse event
    update('down', event, data());
    if (client) {
      client.on_mouse_down(data());
    }
  }
  function on_mouse_move(event) {
    // return if no buttons are pressed
    if (data().buttons.length === 0) {
      return;
    }
    // update and fire the mouse event
    update('move', event, data());
    if (client) {
      client.on_mouse_move(data());
    }
  }
  function on_mouse_up(event) {
    // return if button is not one of [0, 1, 2]
    if (event.button < 0 || event.button > 2) {
      return;
    }
    // return if event.button is not in the button stack
    if (data().buttons.indexOf(event.button) === -1) {
      return;
    }
    // remove the button from the button stack
    // update and fire the mouse event
    update('up', event, data_stack[0]);
    if (client) {
      client.on_mouse_up(data());
    }
    data().buttons.pop();
  }
  function on_mouse_enter(event) { data_stack = [new_data(), new_data()]; }
  function on_mouse_exit(event) { data_stack = [new_data(), new_data()]; }

  function connect(element) {
    element.addEventListener('mousedown', on_mouse_down);
    element.addEventListener('mousemove', on_mouse_move);
    element.addEventListener('mouseup', on_mouse_up);
    element.addEventListener('mouseover', on_mouse_enter);
    element.addEventListener('mouseout', on_mouse_exit);
  }

  function disconnect(element) {
    element.removeEventListener('mousedown', on_mouse_down);
    element.removeEventListener('mousemove', on_mouse_move);
    element.removeEventListener('mouseup', on_mouse_up);
    element.removeEventListener('mouseover', on_mouse_enter);
    element.removeEventListener('mouseout', on_mouse_exit);
  }

  function add(client_) { client = client_; }
  function remove(client_) { client = null; }

  return {
    connect: connect,
    disconnect: disconnect,
    add: add,
    remove: remove
  };
};

// ---------------------------------------------
// WheelFilter
// ---------------------------------------------

// jshint unused:false
xlab.WheelFilter = function (callback) {
  'use strict';

  var client;

  function on_wheel(event) {
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (client) {
      client(delta);
    }
  }

  function connect(element) {
    // IE9, Chrome, Safari, Opera
    element.addEventListener('mousewheel', on_wheel);
    // Firefox
    element.addEventListener('DOMMouseScroll', on_wheel);
  }
  function disconnect(element) {
    // IE9, Chrome, Safari, Opera
    element.removeEventListener('mousewheel', on_wheel);
    // Firefox
    element.removeEventListener('DOMMouseScroll', on_wheel);
  }

  function add(client_) { client = client_; }
  function remove(client_) { client = null; }

  return {
    connect: connect,
    disconnect: disconnect,
    add: add,
    remove: remove
  };
};
/* global
   xwebgl
   ,xlab
   ,Float64Array
*/

/*
---------------------------------------------
ToMatrix
---------------------------------------------
*/
xlab.ToMatrix = function () {
  'use strict';

  var m = new Float64Array(16);

  var _to_matrix = [
    // rotation
    function (w) { xwebgl.mat4.rotation(m, w); },
    // translation H3
    function (w) { xwebgl.mat4.translationH(m, w); },
    // translation R3
    function (w) { xwebgl.mat4.translationR(m, w); },
    // translation S3
    function (w) { xwebgl.mat4.translationS(m, w); }
  ];

  return function (motion) {
    _to_matrix[motion[0]](motion[1]);
    return m;
  };
};

/*
---------------------------------------------
Interpreter
---------------------------------------------
*/

xlab.Interpreter = function (in_spaceform) {
  'use strict';

  // rotation-xy, rotation-z, translation-xy, translation-z
  var SPEED = [0.004, 0.005, 0.002, 0.005];
  var spaceform = in_spaceform;

  var interpret = [
    // button0
    function (position) {
      // rotate xy
      var s = SPEED[0];
      return [0, [position[1] * s, position[0] * s, 0.0]];
    },
    // button1
    function (position) {
      var x = position[0];
      var y = -position[1];
      return Math.abs(x) >= Math.abs(y) ?
        // translate z
        [2 + spaceform, [0.0, 0.0, x * SPEED[3]]]
        :
        // rotate z
        [0, [0.0, 0.0, y * SPEED[1]]];
    },
    // button2
    function (position) {
      // translate xy
      var s = SPEED[2];
      return [2 + spaceform, [position[0] * s, -position[1] * s, 0.0]];
    }
  ];

  return function (button, position) { return interpret[button](position); };
};

/*
---------------------------------------------
Animator
---------------------------------------------
*/
xlab.Animator = function (callback) {
  'use strict';

  var SPEED = 0.02;
  var DECAY = 0.99;

  var to_matrix = xlab.ToMatrix();
  var _m = null;
  var _time = 0;

  function start(m) {
    _m = m;
    _time = Date.now();
  }
  function stop() { _m = null; }

  function update() {
    if (_m === null) {
      return;
    }
    var time = Date.now();
    var dt = (time - _time) * SPEED;
    var m = [_m[0], [_m[1][0] * dt, _m[1][1] * dt, _m[1][2] * dt]];
    callback(to_matrix(m));
    // decay
    if (DECAY !== 1.0) {
      _m = [_m[0], [_m[1][0] * DECAY, _m[1][1] * DECAY, _m[1][2] * DECAY]];
    }
    _time = time;
  }

  return { start: start, stop: stop, update: update };
};

/*
---------------------------------------------
Position
---------------------------------------------
*/
xlab.Position = function () {
  'use strict';
  var m = new Float64Array(16);
  xwebgl.mat4.assign_identity(m);
  var tmp = new Float64Array(16);

  function reset() { xwebgl.mat4.assign_identity(m); }
  function inject(a) {
    // FIX: don't need tmp

    xwebgl.mat4.mulMM(tmp, a, m);

    xwebgl.mat4.assign(m, tmp);
  }

  return { reset: reset, inject: inject, transform: function () { return m; } };
};

/*
---------------------------------------------
PositionR3

Accumulates translations and rotations separately
so that rotation is about the center of the object, not about the origin.

Assumes object center is at the origin.
---------------------------------------------
*/
xlab.PositionR3 = function (center) {
  'use strict';
  var R = new Float64Array(9);
  xwebgl.mat3.assign_identity(R);
  var T = [0.0, 0.0, 0.0];
  var tmp3 = new Float64Array(9);
  var tmp4 = new Float64Array(16);

  /**
     Multiply (upper left 3x3 block of a 4x4 matrix) * (3x3 matrix) = (3x3
     matrix).
  */
  function mul43(c, a, b) {
    var a00 = a[0], a01 = a[4], a02 = a[8], a10 = a[1], a11 = a[5], a12 = a[9],
      a20 = a[2], a21 = a[6], a22 = a[10];

    var b0 = b[0], b1 = b[1], b2 = b[2];
    c[0] = a00 * b0 + a01 * b1 + a02 * b2;
    c[1] = a10 * b0 + a11 * b1 + a12 * b2;
    c[2] = a20 * b0 + a21 * b1 + a22 * b2;

    b0 = b[3];
    b1 = b[4];
    b2 = b[5];
    c[3] = a00 * b0 + a01 * b1 + a02 * b2;
    c[4] = a10 * b0 + a11 * b1 + a12 * b2;
    c[5] = a20 * b0 + a21 * b1 + a22 * b2;

    b0 = b[6];
    b1 = b[7];
    b2 = b[8];
    c[6] = a00 * b0 + a01 * b1 + a02 * b2;
    c[7] = a10 * b0 + a11 * b1 + a12 * b2;
    c[8] = a20 * b0 + a21 * b1 + a22 * b2;
  }

  /**
    Packs rotation part R and translation part T
    into a mat4.
  */
  function pack(out, R, T) {
    out[0] = R[0];
    out[4] = R[3];
    out[8] = R[6];
    out[12] = T[0];

    out[1] = R[1];
    out[5] = R[4];
    out[9] = R[7];
    out[13] = T[1];

    out[2] = R[2];
    out[6] = R[5];
    out[10] = R[8];
    out[14] = T[2];

    out[3] = 0.0;
    out[7] = 0.0;
    out[11] = 0.0;
    out[15] = 1.0;
  }

  function reset() {
    xwebgl.mat3.assign_identity(R);
    xwebgl.mat4.assign_identity(T);
  }
  function inject(a) {
    var is_translation = a[12] !== 0.0 || a[13] !== 0.0 || a[14] !== 0.0;
    if (is_translation) {
      T[0] += a[12];
      T[1] += a[13];
      T[2] += a[14];
    } else {
      mul43(tmp3, a, R);
      xwebgl.mat3.assign(R, tmp3);
    }
  }

  /*
    Computes C * T * R * Inverse[C]
    with 4x4 matrices
      C = center translation matrix
      T = translation matrix
      R = rotation matrix
  */
  function transform() {
    var K = [0.0, 0.0, 0.0];
    xwebgl.mat3.mulMV(K, R, center);
    K[0] = T[0] + center[0] - K[0];
    K[1] = T[1] + center[1] - K[1];
    K[2] = T[2] + center[2] - K[2];
    pack(tmp4, R, K);
    return tmp4;
  }

  return { reset: reset, inject: inject, transform: transform };
};

/*
---------------------------------------------
Mouse
---------------------------------------------
*/
xlab.Mouse = function (initial_spaceform) {
  'use strict';

  var TIME_CUTOFF = 200;
  // FIX
  var center = [0.0, 0.0, 0.0];
  var spaceform;
  var to_matrix = xlab.ToMatrix();
  var interpreter;
  var position;
  var animator;

  /*jshint unused:false*/
  function on_mouse_down(event) {
    animator.stop();
  }
  function on_mouse_move(event) {
    position.inject(to_matrix(interpreter(event.button, event.dposition)));
  }
  function on_mouse_up(event) {
    if (event.dtime < TIME_CUTOFF) {
      animator.start(interpreter(event.button, event.dposition));
    }
  }
  /*jshint unused:true*/

  //var listener = xlab.MouseListener(
  //{down : on_down, move : on_move, up : on_up});

  function set_spaceform(in_spaceform) {
    if (spaceform === in_spaceform) { return; }
    spaceform = in_spaceform;
    interpreter = xlab.Interpreter(spaceform);
    position = spaceform === 0 ? xlab.PositionR3(center) : xlab.Position();
    animator = xlab.Animator(position.inject);
  }

  set_spaceform(initial_spaceform || 0);

  /*
  function connect(element) {
    listener.connect(element);
  }
  function disconnect(element) {
    listener.disconnect(element);
  }
  */
  function update() {
    animator.update();
  }
  function transform() {
    return position.transform();
  }

  return {
    //connect : connect,
    //disconnect : disconnect,
    update: update,
    transform: transform,
    set_spaceform: set_spaceform,
    slot: { on_mouse_down: on_mouse_down, on_mouse_up: on_mouse_up, on_mouse_move: on_mouse_move }
  };
};
/* global
   xlab
   ,xwebgl
   ,Float64Array
*/

/*
---------------------------------------------
CameraUtil
---------------------------------------------
*/
xlab.CameraUtil = function () {
  'use strict';

  /**
    Computes the camera position from a camera transform m.
  */
  function camera_position(m) {
    var a00 = m[0];
    var a02 = m[8];
    var a03 = m[12];
    var a11 = m[5];
    var a12 = m[9];
    var a13 = m[13];
    var a32 = m[11];
    var a33 = m[15];

    return [
      (a03 * a32 - a02 * a33) / a00, (a13 * a32 - a12 * a33) / a11, a33, -a32
    ];
  }

  /**
     Compute ranges [[dx, dy], [zu, zv]].

     @param[in] center 3-vector
     @param[in] radius 3-vector
     @param[in] view_direction 2-vector
     @param[in] aspect 2-vector
     @return [[dx, dy], [zu, zv]].
  */
  function compute_ranges(center, radius, view_direction, aspect) {
    var dx;
    var dy;
    var zu;
    var zv;

    if (aspect[0] * radius[1] >= aspect[1] * radius[0]) {
      // wide window
      dy = radius[1];
      dx = (aspect[0] / aspect[1]) * dy;

      zu = dy * view_direction[0] + center[2] * view_direction[1];
    } else {
      // tall window
      dx = radius[0];
      dy = (aspect[1] / aspect[0]) * dx;

      zu = dx * view_direction[0] + center[2] * view_direction[1];
    }
    zv = view_direction[1];

    return [[dx, dy], [zu, zv]];
  }

  /**
     Compute z cutoffs.

     @param z 2-vector [zu, zv].
     @param center 3-vector
     @param user_cutoff 2-vector
     @param view_direction 2-vector
     @return cutoff 2-vector
  */
  function compute_cutoff(z, center, user_cutoff, view_direction) {

    // cutoff determining perspective/orthographic camera
    var VIEWANGLE_CUTOFF = 1.0e-6;
    var ortho = view_direction[1] < VIEWANGLE_CUTOFF;

    if (ortho) {
      // orthgraphic camera
      return [
        center[2] + user_cutoff[1],
        center[2] + user_cutoff[0]
      ];
    } else {
      // perspective camera
      var r = z[0] / z[1];
      return [
        r - (r - center[2]) * user_cutoff[0],
        r - (r - center[2]) * user_cutoff[1]
      ];
    }
  }

  /**
     radius = radius of the sphere which the camera encompasses.

     center = center of the sphere which the camera encompasses.

     aspect = {dx, dy}.
     Only used as a ratio.

     view_direction = {cos(theta), sin(theta)}, where theta is the viewing
     halfangle.
     Only used as a ratio.
     For orthogonal projection, view_direction = {1, 0}.

     @param[out] m 4x4 camera transform
     @param[in] box=[x0,x1,y0,y1,z0,z1].
     @param[in] aspect 2-vector
     @param[in] view_direction 2-vector
     @param[in] user_cutoff 2-vector
  */
  function camera_transform(m, box, aspect, view_direction, user_cutoff) {

    if (aspect[0] === 0 || aspect[1] === 0) {
      throw Error('invalid aspect ratio ' + aspect.toString());
    }
    var v = xlab.math.normalize2(view_direction);

    //var radius = xlab.math.box.radius(box);
    //var center = xlab.math.box.center(box);

    // Compute ranges
    var ranges = compute_ranges(box.center, box.radius, v, aspect);
    var dx = ranges[0][0];
    var dy = ranges[0][1];
    var zu = ranges[1][0];
    var zv = ranges[1][1];

    // compute z cutoffs
    var cutoff =
      compute_cutoff([zu, zv], box.center, user_cutoff, view_direction);

    // x0, x1
    var rectangle = [
      box.center[0] - dx, box.center[0] + dx,
      // y0, y1
      box.center[1] - dy, box.center[1] + dy,
      // z
      box.center[2]
    ];
    // camera (px, py, pz, pw)
    var camera = [box.center[0] * zv, box.center[1] * zv, zu, zv];

    xwebgl.mat4.camera(m, rectangle, cutoff, camera);

    if (isNaN(m[0])) {
      throw Error('nan in camera; aspect=' + aspect + ' box=' + box);
    }
  }

  // return {transform: function(){ return transform; }, update: update};
  return { transform: camera_transform, position: camera_position };
};

/*
---------------------------------------------
CameraUtil
---------------------------------------------
*/
xlab.Camera = function (aspect_) {
  'use strict';

  var INITIAL_SCALE = 1.1;
  var WHEEL_SCALE = 1.1;
  var util = xlab.CameraUtil();
  var user_cutoff = [0.1, 10.0];
  var angle = 5.0;
  var view_direction =
    [Math.cos(angle * Math.PI / 180.0), Math.sin(angle * Math.PI / 180.0)];
  var m = new Float64Array(16);
  var scale = INITIAL_SCALE;
  var box = { center: [0.0, 0.0, 0.0], radius: [1.0, 1.0, 1.0] };
  var aspect = aspect_;
  var position;

  // compute initial camera matrix
  util.transform(m, box, aspect, view_direction, user_cutoff);

  function set_box(box_) {
    box = box_;
    // reset scale
    scale = INITIAL_SCALE;
  }

  function update(aspect_) {
    aspect = aspect_;
    var radius = [scale * box.radius[0], scale * box.radius[1], scale * box.radius[2]];
    var box2 = { center: box.center, radius: radius };
    util.transform(m, box2, aspect, view_direction, user_cutoff);
    position = util.position(m);
  }

  function on_wheel(delta) {
    var s = delta >= 0.0 ? WHEEL_SCALE : 1.0 / WHEEL_SCALE;
    scale *= s;
    update(aspect);
  }

  //var wheel = xlab.WheelListener(on_wheel);

  return {
    transform: function () { return m; },
    position: function () { return position; },
    update: update,
    set_box: set_box,
    //connect : wheel.connect,
    //disconnect : wheel.disconnect,
    on_wheel: on_wheel
  };
};
/* global
   xlab
*/

//-------------------------------------------
// grid
//-------------------------------------------

/*jshint bitwise: false*/

/*
  Helper function for xlab.triangulate_grid() below.
*/
xlab._triangulate_grid = function (A, B, start, x, y) {
  'use strict';

  if (A < 2 || B < 2) {
    throw Error('grid too small');
  }

  var size = B * (2 * A - 2) + A - 2;

  var out;
  if (A * B < (1 << 8)) { // lol décalage binaire vers la gauche.
    out = new Int8Array(size);
  } else if (A * B < (1 << 16)) {
    out = new Int16Array(size);
  } else {
    throw Error('grid too large');
  }

  var i = 0;
  var p = start;
  var s = y;
  for (var a = 0; a !== A - 1; ++a) {
    for (var b = 0; b !== B; ++b) {
      out[i++] = p;
      out[i++] = p + x;
      p += s;
    }
    p += x - s;
    if (a !== A - 2) {
      // degenerate connecting triangles
      out[i++] = p;
    }
    s = -s;
  }

  return out;
};

/**
  Computes a triangle strip representing a grid of size (I,J).
*/
xlab.triangulate_grid = function (gridsize) {
  'use strict';

  var I = gridsize[0];
  var J = gridsize[1];
  if (I >= J) {
    // horizontal
    return xlab._triangulate_grid(J, I, I * (J - 1), -I, 1);
  } else {
    // vertical
    return xlab._triangulate_grid(I, J, 0, 1, I);
  }
};


xlab._make_color = function (json) {
  'use strict';
  var color = xlab.util.flatten([
    [0.8, 0.3, 0.3, 1.0], // red
    [0.3, 0.3, 0.8, 1.0], // blue
    [0.3, 0.5, 0.3, 1.0], // green
    [0.76, 0.6, 0.32, 1.0], // orange
    [0.82, 0.72, 0.38, 1.0], // yellow
    [0.2, 0.4, 0.7, 1.0], // blue2
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0]
  ]);

  var buffer = new Float32Array(color);
  var divisor = json.transform.count / json.transform.block_count;
  var packing = [{ 'name': color, 'type': 'float32', 'stride': 4 }];
  json.color = { 'packing': packing, 'data': buffer, 'divisor': divisor };
};

//-------------------------------------------
// load_surface
//-------------------------------------------
xlab.load_file = load_file;

xlab.load_surface = function (url, callback) {
  'use strict';
  if (/\.json$/.test(url)) {
    xlab.load_file(url, function (text) {
      xlab._on_surface_json(text, callback);
    });
  } else if (/\.wgl$/.test(url)) {
    xlab.load_file(url, function (data) {
      xlab._on_surface_wgl(data, callback);
    });
  } else if (/\.obj$/.test(url) || /data:model\/obj/.test(url)) {
    xlab.load_file(url, function (data) {
      xlab._on_surface_obj(data, callback);
    });
  } else {
    throw Error('unsupported surface file extension');
  }
};

xlab._on_surface_obj = function (data, callback) {
  const obj_text = new TextDecoder("utf-8").decode(data);
  const obj_json = obj_to_json(obj_text);

  const surface = {};
  make_spaceform(obj_json, surface);
  make_vertex(obj_json, surface);
  make_element(obj_json, surface);
  make_transform(obj_json, surface);
  make_box(obj_json, surface);
  make_color(surface);

  callback(surface)
}

xlab._on_surface_json = function (data, callback) {
  'use strict';

  var text = String.fromCharCode.apply(null, new Uint8Array(data));
  var surface = JSON.parse(text);

  if ('vertex' in surface) {
    surface.vertex.data = new Float32Array(surface.vertex.data);
  }
  else if ('v' in surface) {
    surface.vertex.data = new Float32Array(surface["v"].flat(1));
  }

  if ('element' in surface) {
    if ('grid' in surface.element) {
      surface.element.mode = 'triangle_strip';
      surface.element.data = xlab.triangulate_grid(surface.element.grid);
      switch (surface.element.data.BYTES_PER_ELEMENT) {
        case 1:
          surface.element.type = 'uint8';
          break;
        case 2:
          surface.element.type = 'uint16';
          break;
        default:
          throw Error('unsupported buffer type');
      }
    } else {
      switch (surface.element.type) {
        case 'uint8':
          surface.element.data = new Uint8Array(surface.element.data);
          break;
        case 'uint16':
          surface.element.data = new Uint16Array(surface.element.data);
          break;
        default:
          throw Error('unsupported numbertype ' + surface.element.type);
      }
    }
  }
  else if ("f" in surface) {
    surface.element.type = 'uint16';
    surface.element.data = new Uint16Array(surface.f.flat(1));
  }

  if ('transform' in surface) {
    surface.transform.data = new Float32Array(surface.transform.data);
  }

  xlab._make_color(surface);

  if (!('box' in surface)) {
    surface.box = { center: [0, 0, 0], radius: [1, 1, 1] };
  }

  callback(surface);
};

xlab._on_surface_wgl = function (data, callback) {
  'use strict';

  var view = new Int32Array(data);
  var a, jsonText, json, surface, x;

  if (view[0] !== parseInt('0x42414c58', 16) ||
    view[1] !== parseInt('0x4e4f534a', 16)) {
    throw Error('header is not XLABJSON');
  }

  a = new Uint8Array(data.slice(view[2], view[3]));
  jsonText = String.fromCharCode.apply(null, a);
  json = JSON.parse(jsonText);

  surface = json;

  if ('vertex' in surface) {
    x = surface.vertex.offset;
    surface.vertex.data = new Float32Array(data.slice(x[0], x[1]));
    delete surface.vertex.offset;
  }

  if ('element' in surface) {
    if ('grid' in surface.element) {
      surface.element.mode = 'triangle_strip';
      surface.element.data = xlab.triangulate_grid(surface.element.grid);
      switch (surface.element.data.BYTES_PER_ELEMENT) {
        case 1: surface.element.type = 'uint8'; break;
        case 2: surface.element.type = 'uint16'; break;
        default: throw Error('unsupported buffer type');
      }
    } else {
      x = surface.element.offset;
      switch (surface.element.type) {
        case 'uint8':
          surface.element.data = new Uint8Array(data.slice(x[0], x[1]));
          break;
        case 'uint16':
          surface.element.data = new Uint16Array(data.slice(x[0], x[1]));
          break;
        default:
          throw Error('unsupported numbertype ' + surface.element.type);
      }
      delete surface.element.offset;
    }
  }

  if ('transform' in surface) {
    x = surface.transform.offset;
    surface.transform.data = new Float32Array(data.slice(x[0], x[1]));
    delete surface.transform.offset;
  }

  xlab._make_color(surface);

  if (!('box' in surface)) {
    surface.box = { center: [0, 0, 0], radius: [1, 1, 1] };
  }

  callback(surface);
};



//---------------------------------
// import shaders
//---------------------------------
async function fetchText(url) {
  const result = await fetch(url, { cache: "no-store" }) // no cache = no need for ctrl+F5;
  return await result.text();
}
xlab.vshader = await fetchText("/shaders/vshader.glsl");
xlab.fshader = await fetchText("/shaders/fshader.glsl");
/* global
   xwebgl
   ,xlab
*/

//---------------------------------------------------
// ShaderCache
//---------------------------------------------------
xlab.ShaderCache = function (gl, shader_type, src) {
  'use strict';

  var shader = [];

  function get_shader(n) {
    if (!shader[n]) {
      shader[n] = xwebgl.compile(gl, shader_type, src[n]);
    }
    return shader[n];
  }

  return { get_shader: get_shader };
};

//---------------------------------------------------
// VertexShaderCache
//---------------------------------------------------
xlab.VertexShaderCache = function (gl) {
  'use strict';

  var version = '#version 100\n';
  var precision = 'precision highp float;\n';
  var header = version + precision;

  var src = [
    header + '#define GEOMETRY 0\n#define INSTANCE 0\n' + xlab.vshader,
    header + '#define GEOMETRY 1\n#define INSTANCE 0\n' + xlab.vshader,
    header + '#define GEOMETRY 0\n#define INSTANCE 1\n' + xlab.vshader,
    header + '#define GEOMETRY 1\n#define INSTANCE 1\n' + xlab.vshader,
    header + '#define GEOMETRY 0\n#define INSTANCE 2\n' + xlab.vshader,
    header + '#define GEOMETRY 1\n#define INSTANCE 2\n' + xlab.vshader
  ];

  var shader_cache = xlab.ShaderCache(gl, gl.VERTEX_SHADER, src);

  function get_shader(geometry, instance) {
    var n = Number(geometry) + Number(instance) * 2;
    return shader_cache.get_shader(n);
  }
  return { get_shader: get_shader };
};

//---------------------------------------------------
// FragmentShaderCache
//---------------------------------------------------
xlab.FragmentShaderCache = function (gl) {
  'use strict';

  var version = '#version 100\n';
  var precision = 'precision mediump float;\n';
  var header = version + precision;

  var src = [
    header + '#define LIGHT_COUNT 3\n#define TEX 0\n' + xlab.fshader,
    header + '#define LIGHT_COUNT 3\n#define TEX 1\n' + xlab.fshader];

  var shader_cache = xlab.ShaderCache(gl, gl.FRAGMENT_SHADER, src);

  function get_shader(tex) {
    return shader_cache.get_shader(Number(tex));
  }

  return { get_shader: get_shader };
};

//---------------------------------------------------
// Uniforms
//---------------------------------------------------

xlab.Uniforms = function (surface) {
  'use strict';
  //var noneuclidean = xlab.util.spaceform_signature(surface.spaceform) !== 0;
  var grid_frequency = 'texture_scale' in surface ? surface.texture_scale : [1.0, 1.0];
  return {
    'light_position': xlab.util.flatten([
      [1.0, 1.0, 1.0, 0.0], [0.0, 1.0, 1.0, 0.0], [1.0, 0.0, 1.0, 0.0]
    ]),
    'diffuse_light_color': xlab.util.flatten([
      [0.4, 0.4, 0.4, 1.0], [0.4, 0.4, 0.4, 1.0], [0.4, 0.4, 0.4, 1.0]
    ]),
    'specular_light_color': xlab.util.flatten([
      [0.4, 0.4, 0.4, 1.0], [0.4, 0.4, 0.4, 1.0], [0.4, 0.4, 0.4, 1.0]
    ]),
    // back, front
    'fgcolor': xlab.util.flatten([[0.8, 0.8, 0.8], [0.8, 0.8, 0.8]]),
    'color_scale': [0.3, 1.0],
    //'color_spec': xlab.util.flatten( [ [1.0, 0.8, 0.1, 0.2], [1.0, 0.8, 0.6, 0.6] ] ),
    'diffuse_factor': 0.4,
    'specular_factor': 0.5,
    'grid_frequency': [grid_frequency, grid_frequency],
    'grid_width': [[0.7, 0.7], [0.7, 0.7]],
    'specular_color': [[0.2, 0.2, 0.2, 1.0], [0.4, 0.4, 0.4, 1.0]]
  };
};

//---------------------------------------------------
// Shader
//---------------------------------------------------

function has_texture(surface) {
  'use strict';
  for (var i = 0; i !== surface.vertex.packing.length; ++i) {
    if (surface.vertex.packing[i].name === 'texture') {
      return true;
    }
  }
  return false;
}

xlab.Shader = function (gl) {
  'use strict';
  var vshader_cache = xlab.VertexShaderCache(gl);
  var fshader_cache = xlab.FragmentShaderCache(gl);


  function get_shader(surface) {
    //--------------------------------
    // vshader
    var geometry = surface.spaceform.sign === 0 ? 0 : 1;
    var instanced =
      'transform' in surface ?
        (xwebgl.getExtension(gl, 'ANGLE_instanced_arrays') === null ? 1 : 2) :
        0;
    //instanced =
    //	'transform' in surface ?
    //	1 :
    //	0;

    var vshader = vshader_cache.get_shader(geometry, instanced);

    //--------------------------------
    // fshader
    var fwidth = has_texture(surface) &&
      Boolean(xwebgl.getExtension(gl, 'OES_standard_derivatives'));
    //fwidth = false;
    var fshader = fshader_cache.get_shader(fwidth);


    var attributes = [
      { 'name': 'position', 'type': 'vec4' },
      { 'name': 'normal', 'type': 'vec4' }, { 'name': 'texture', 'type': 'vec2' },
      { 'name': 'instance_transform', 'type': 'mat4' },
      { 'name': 'instance_orientation', 'type': 'vec2' },
      { 'name': 'instance_color', 'type': 'vec4' }
    ];

    var uniforms = [
      { 'name': 'instance_transform', 'type': 'mat4' },
      { 'name': 'instance_orientation', 'type': 'vec2' },
      { 'name': 'instance_color', 'type': 'vec4' },
      { 'name': 'object_transform', 'type': 'mat4' },
      { 'name': 'camera_transform', 'type': 'mat4' },
      { 'name': 'camera_position', 'type': 'vec4' },
      { 'name': 'light_position', 'type': 'vec4' },
      { 'name': 'diffuse_light_color', 'type': 'vec4' },
      { 'name': 'specular_light_color', 'type': 'vec4' },
      { 'name': 'diffuse_factor', 'type': 'float' },
      { 'name': 'specular_factor', 'type': 'float' },
      { 'name': 'fgcolor', 'type': 'vec3' },
      { 'name': 'color_scale', 'type': 'vec2' },
      { 'name': 'specular_color', 'type': 'vec4' },
      { 'name': 'grid_frequency', 'type': 'vec2' },
      { 'name': 'grid_width', 'type': 'vec2' },
    ];

    // program
    var program = xwebgl.Program(gl, [vshader, fshader], attributes, uniforms);
    program.uniform_constants = xlab.Uniforms(surface);
    return program;
  }

  return { get_shader: get_shader };
};
/*global
  xlab
  ,WebGLDebugUtils
*/
//jshint unused:false
xlab.Panel = function (document, window, options) {
  'use strict';

  function log_gl(fn, args) {
    console.log('gl.' + fn + '(' +
      WebGLDebugUtils.glFunctionArgsToString(fn, args), ')');
  }

  options = options || {};

  if (!window.WebGLRenderingContext) {
    // this browser is not aware of WebGL
    alert('Your browser does not support WebGL. Try get.webgl.org.');
  }

  var background_color = [0.05, 0.06, 0.07, 1.0];
  var callback;
  var fullscreen = true;
  // fixed_size is ignored if fullscreen==true
  var fixed_size = [400, 400];

  function _create_gl(options) {
    options = options || {};
    var canvas = document.createElement('canvas');

    // disable context menu
    canvas.oncontextmenu = function () { return false; };

    var gl = null;
    try {
      gl = canvas.getContext('webgl', options);
      if (!gl) {
        gl = canvas.getContext('experimental-webgl', options);
        if (!gl) {
          alert('Could not start WebGL. Try get.webgl.org/troubleshooting.');
        }
      }
    }
    catch (error) {
      throw error;
    }


    //---------------------------------
    // debugging
    if (options['debug'] || options['log']) {
      console.log('enabling webgl debugging');
      if (options['log']) {
        console.log('enabling webgl logging');
        gl = WebGLDebugUtils.makeDebugContext(gl, undefined, log_gl);
      }
      else {
        gl = WebGLDebugUtils.makeDebugContext(gl);
      }
    }
    //---------------------------------

    gl.enable(gl.DEPTH_TEST);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.enable(gl.BLEND);
    return gl;
  }

  var gl = _create_gl(options);

  function _set_viewport(gl) {
    var canvas = gl.canvas;

    var size_request;

    if (fullscreen) {
      size_request = [window.innerWidth, window.innerHeight];
    }
    else {
      size_request = fixed_size;
    }

    if ([canvas.width, canvas.height] !== size_request) {
      canvas.width = size_request[0];
      canvas.height = size_request[1];
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  function _gl_clear(gl) {
    //jshint bitwise:false
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var b = background_color;
    gl.clearColor(b[0], b[1], b[2], b[3]);
  }

  function render(gl) {
    _set_viewport(gl);
    _gl_clear(gl);
    callback(gl);
  }

  function run() {
    (function loop() {
      window.requestAnimationFrame(loop);
      render(gl);
    })();
  }

  function add(callback_) {
    callback = callback_;
  }
  function remove(callback_) {
    callback = null;
  }

  return {
    gl: function () { return gl; },
    run: run,
    background_color: function () { return background_color; },
    set_background_color: function (_) { background_color = _; },
    size: function () {
      return [gl.canvas.width, gl.canvas.height];
    },
    add: add,
    remove: remove,
    canvas: gl.canvas
  };
};
/*global
xlab
,XMLHttpRequest
  ,Uint8Array
 */


xlab.load_image = function (url, callback) {
  'use strict';

  var image = new Image();
  image.onload = function () { callback(image); };
  image.src = url;
};

xlab.image_url = function (data) {
  'use strict';
  var blob = new Blob([data], { type: 'image/png' });
  var urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
};

xlab.load_image_from_data = function (data, callback) {
  'use strict';
  var image = new Image();
  // attach an onload callback to the image
  image.onload = function () { callback(image); };
  // load the image (asynchronous)
  image.src = xlab.image_url(data);
};


/*
xlab.load_cubemap = function(url, callback) {
  'use strict';

  var images = [];

  function on_image_load(i, image) {
    images[i] = image;
    if (images.length === 6) {
      callback(images);
    }
  }

  function make_image_callback(i, image) {
    return function() { on_image_load(i, image); };
  }

  function on_load(data) {

    var view = new Int32Array(data);

    //--------------------------
    // FIX: slice before reading the offsets to avoid possible copy
    //--------------------------

    for (var i = 0; i !== 12; i += 2) {
      var idata = new Uint8Array( data.slice(view[i], view[i+1]) );
      var image = new Image();
      image.onload = make_image_callback(i/2, image);
      image.src = xlab.image_url(idata);
    }
  }

  xlab.load_file(url, on_load);
};
*/


xlab._round_up = function (length, alignment) {
  'use strict';
  if (length % alignment === 0) { return length; }
  return length + (alignment - length % alignment);
};

xlab.load_images = function (url, callback) {
  'use strict';

  var ALIGNMENT = 4;

  var images = [];
  var total = 0;

  function on_image(i, image) {
    images[i] = image;
    if (images.length === total) {
      callback(images);
    }
  }

  function make_image_callback(i, image) {
    return function () { on_image(i, image); };
  }

  function on_file(data) {
    var p = 0;
    var i = 0;

    while (p < data.byteLength) {
      var length = new Uint32Array(data.slice(p, p + 4))[0];
      p += 4;
      if (xlab._round_up(p + length, ALIGNMENT) >= data.byteLength) {
        total = i + 1;
      }
      var image = new Image();
      var slice = new Uint8Array(data.slice(p, p + length));
      url = xlab.image_url(slice);

      image.onload = make_image_callback(i, image);
      image.src = url;
      p = xlab._round_up(p + length, ALIGNMENT);
      ++i;
    }
  }

  xlab.load_file(url, on_file);
};
/*global
  xlab
*/

xlab.rgba_string = function (x) {
  'use strict';
  return 'rgba(' + Math.round(x[0] * 255) + ',' + Math.round(x[1] * 255) + ',' +
    Math.round(x[2] * 255) + ',' + x[3] + ')';
};

xlab.Button = function (document, index, callback) {
  'use strict';

  var SIZE = [20, 20];
  var RADIUS = 8;
  var LINE_WIDTH = 4;
  var canvas;

  var DISABLED = 0, NORMAL = 1, ACTIVE = 2;
  var state = DISABLED;

  var color = [
    // disabled
    [0.2, 0.2, 0.2, 0.5],
    // normal
    [0.5, 0.5, 0.5, 0.5],
    // active
    [1.0, 1.0, 1.0, 0.5]
  ];
  var hover_color = [0.5, 1.0, 0.0, 0.5];
  var down_color = [0.0, 0.5, 1.0, 0.5];

  function draw(color) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = xlab.rgba_string(color);
    ctx.beginPath();
    ctx.arc(0.5 * SIZE[0], 0.5 * SIZE[1], RADIUS, 0.0, 2.0 * Math.PI);
    ctx.stroke();
  }

  function on_mouse_over() { draw(state ? hover_color : color[state]); }
  function on_mouse_out() { draw(color[state]); }
  function on_mouse_down() { draw(state ? down_color : color[state]); }
  function on_mouse_up() {
    if (state === DISABLED) {
      return;
    }
    draw(color[state]);
  }

  function init() {
    canvas = document.createElement('canvas');
    canvas.width = SIZE[0];
    canvas.height = SIZE[1];
    // top,right,bottom,left
    canvas.style.margin = '10px 5px 0px 5px';

    canvas.onclick = callback;
    canvas.onmouseover = function () { on_mouse_over(); };
    canvas.onmouseout = function () { on_mouse_out(); };
    canvas.onmousedown = function () { on_mouse_down(); };
    canvas.onmouseup = function () { on_mouse_up(); };

    draw(color[DISABLED]);
  }
  init();

  function enable() {
    state = NORMAL;
    draw(color[state]);
  }

  function set_active(flag) {
    if (state === DISABLED) {
      return;
    }
    state = flag ? ACTIVE : NORMAL;
    draw(color[state]);
  }

  function set_color(c) {
    color = [c.disabled, c.normal, c.active];
    hover_color = c.hover;
    down_color = c.down;
    draw(color[state]);
  }

  return {
    element: function () { return canvas; },
    enable: enable,
    set_active: set_active,
    set_color: set_color,
    size: SIZE
  };
};

/*
---------------------------------------------
ButtonBox
---------------------------------------------
*/
xlab.ButtonBox = function (document, count, callback) {
  'use strict';
  var div = document.createElement('div');
  var button = [];

  function make_callback(n) {
    return function () {
      for (var i = 0; i !== count; ++i) {
        button[i].set_active(false);
      }
      button[n].set_active(true);
      callback(n);
    };
  }

  function init() {
    for (var i = 0; i !== count; ++i) {
      var b = xlab.Button(document, i, make_callback(i));
      div.appendChild(b.element());
      button.push(b);
    }
  }
  init();

  function select(n) {
    for (var i = 0; i !== count; ++i) {
      button[i].set_active(false);
    }
    button[n].set_active(true);
  }

  function set_color(color) {
    for (var i = 0; i !== count; ++i) {
      button[i].set_color(color);
    }
  }

  return {
    element: function () { return div; },
    enable: function (i) { button[i].enable(); },
    select: select,
    set_color: set_color
  };
};
/*global
  xlab
*/

xlab.ViewerPanel = function () {
  'use strict';

  var panel = xlab.Panel(document, window);
  var mouse_filter = xlab.MouseFilter();
  var wheel_filter = xlab.WheelFilter();

  function init() {
    mouse_filter.connect(panel.gl().canvas);
    wheel_filter.connect(panel.gl().canvas);
  }
  init();

  function add(client) {
    panel.add(client.on_draw);
    mouse_filter.add(client);
    wheel_filter.add(client.on_wheel);
  }
  function remove(client) {
    panel.remove(client.draw);
    mouse_filter.remove(client);
    wheel_filter.remove(client.on_wheel);
  }

  return {
    add: add,
    remove: remove,
    run: panel.run,
    canvas: panel.gl().canvas,
    gl: panel.gl,
    set_background_color: panel.set_background_color
  };
};
/* global
   xlab
*/

xlab.ViewerClient = function () {
  'use strict';

  var mouse = xlab.Mouse();
  var camera = xlab.Camera([1, 1]);
  var program;
  var drawer;
  var surface_count = 0;

  function dispose() {
    if (program) {
      program.dispose();
    }
  }

  function set(surface, drawer_, program_) {
    dispose();
    mouse.set_spaceform(surface.spaceform.sign);

    if (surface_count === 0) {
      camera.set_box(surface.box);
      ++surface_count;
    }

    program = program_;
    drawer = drawer_;
  }

  function on_draw(gl) {
    if (!drawer) {
      return;
    }

    program.enable();

    camera.update([gl.canvas.clientWidth, gl.canvas.clientHeight]);
    mouse.update();

    // camera transform
    program.uniforms.camera_transform(camera.transform());

    // camera_position
    program.uniforms.camera_position(camera.position());

    // object transform
    program.uniforms.object_transform(mouse.transform());
    program.set_uniforms(program.uniform_constants);

    drawer.update();
    program.disable();
  }

  return {
    set: set,
    slot: {
      on_mouse_down: mouse.slot.on_mouse_down,
      on_mouse_up: mouse.slot.on_mouse_up,
      on_mouse_move: mouse.slot.on_mouse_move,
      on_wheel: camera.on_wheel,
      on_draw: on_draw
    }
  };
};
/*global
  xwebgl
  ,xlab
*/
xlab.Viewer = function () {
  'use strict';
  var surface_buttons;
  //var shader_buttons;

  var key_callback = {
    '32': function () { console.log('space'); },
    '37': function () { console.log('left'); },
    '39': function () { console.log('right'); }
  };

  var viewer_panel = xlab.ViewerPanel();
  var viewer_client = xlab.ViewerClient();
  var shader_cache = xlab.Shader(viewer_panel.gl());
  var drawer_cache = xwebgl.DrawerCache(viewer_panel.gl());

  // listen to keyevents in document (rather than canvas)
  // to kill default key responses of the browser
  var key = xlab.Key(document, key_callback);

  function init() {
    document.body.style.margin = '0';
    // hide scrollbars
    document.body.style.overflow = 'hidden';

    // panel
    var gl = viewer_panel.gl();
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.left = '0';
    gl.canvas.style.top = '0';
    // gl.canvas.style.zIndex = '-1';
    document.body.appendChild(gl.canvas);

    viewer_panel.add(viewer_client.slot);
  }
  init();

  function on_surface_button(id) {
    var surface = drawer_cache.get_surface(id);
    if (!surface) { return; }
    var program = shader_cache.get_shader(surface);
    viewer_client.set(surface, drawer_cache.get_drawer(id, program), program);
  }

  // callback when a surface is downloaded
  function on_surface(id, in_surface) {
    drawer_cache.set_surface(id, in_surface);
    //surface[id] = in_surface;
    surface_buttons.enable(id);

    // inject surface into viewer (if id==0)
    if (id !== 0) {
      return;
    }

    // initialize surface
    surface_buttons.select(0);
    on_surface_button(0);
  }

  function load(urls) {

    // surface_buttons
    surface_buttons = xlab.ButtonBox(document, urls.length, on_surface_button);
    var e = surface_buttons.element();
    e.style.position = 'absolute';
    e.style.left = '0px';
    e.style.top = '0px';
    document.body.appendChild(surface_buttons.element());

    // load surfaces
    function make_function(index) {
      return function (_) { on_surface(index, _); };
    }

    for (var i = 0; i !== urls.length; i += 1) {
      xlab.load_surface(urls[i], make_function(i));
    }
  }
  function run() { viewer_panel.run(); }

  return { load: load, run: run };
};

export { xlab }