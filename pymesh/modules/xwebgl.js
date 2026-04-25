//jshint unused:false
var xwebgl = {};

/**
   getExtension() is supposed to return null if the extension is not supported.
   Safari 6.2.8 returns an object (not null).
   Workaround: crosscheck against the list getSupportedExtensions()
*/
xwebgl.getExtension = function(gl, name) {
  'use strict';
  var ext = gl.getSupportedExtensions();
  if (ext.indexOf(name) !== -1) {
    console.log('extension supported:', name);
    return gl.getExtension(name);
  }
  else {
    console.log('extension not supported:', name);
    return null;
  }
};
/*global
  xwebgl
*/
//---------------------------------------------
// mat3
//---------------------------------------------
xwebgl.mat3 = {};

xwebgl.mat3.create_zero = function() {
  'use strict';
  return [
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0 ];
};

xwebgl.mat3.create_identity = function() {
  'use strict';
  return [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0];
};

xwebgl.mat3.assign_zero = function(a) {
  'use strict';
  a[0] = 0.0;  a[1] = 0.0;  a[2] = 0.0;
  a[3] = 0.0;  a[4] = 0.0;  a[5] = 0.0;
  a[6] = 0.0;  a[7] = 0.0;  a[8] = 0.0;
};

xwebgl.mat3.assign_identity = function(a) {
  'use strict';
  a[0] = 1.0;  a[1] = 0.0;  a[2] = 0.0;
  a[3] = 0.0;  a[4] = 1.0;  a[5] = 0.0;
  a[6] = 0.0;  a[7] = 0.0;  a[8] = 1.0;
};

xwebgl.mat3.assign = function(out, in_) {
  'use strict';
  out[0] = in_[0];  out[1] = in_[1];  out[2] = in_[2];
  out[3] = in_[3];  out[4] = in_[4];  out[5] = in_[5];
  out[6] = in_[6];  out[7] = in_[7];  out[8] = in_[8];
};

xwebgl.mat3.pack = function(out, in_) {
  'use strict';
  var v = in_[0];
  out[0] = v[0]; out[3] = v[1]; out[6] = v[2];
  v = in_[1];
  out[1] = v[0]; out[4] = v[1]; out[7] = v[2];
  v = in_[2];
  out[2] = v[0]; out[5] = v[1]; out[8] = v[2];
};

xwebgl.mat3.unpack = function(a) {
  'use strict';
  return [
    [a[0],a[3],a[6]],
    [a[1],a[4],a[7]],
    [a[2],a[5],a[8]] ];
};

xwebgl.mat3.mulMV = function( c, a, b ) {
  'use strict';
  var b0 = b[0], b1 = b[1], b2 = b[2];
  c[0] = a[0]*b0 + a[3]*b1 + a[6]*b2;
  c[1] = a[1]*b0 + a[4]*b1 + a[7]*b2;
  c[2] = a[2]*b0 + a[5]*b1 + a[8]*b2;
};

xwebgl.mat3.mulMM = function( c, a, b ) {
  'use strict';
  var a00 = a[0], a01 = a[3], a02 = a[6],
      a10 = a[1], a11 = a[4], a12 = a[7],
      a20 = a[2], a21 = a[5], a22 = a[8];

  var b0 = b[0], b1 = b[1], b2 = b[2];
  c[0] = a00*b0 + a01*b1 + a02*b2;
  c[1] = a10*b0 + a11*b1 + a12*b2;
  c[2] = a20*b0 + a21*b1 + a22*b2;

  b0 = b[3]; b1 = b[4]; b2 = b[5];
  c[3] = a00*b0 + a01*b1 + a02*b2;
  c[4] = a10*b0 + a11*b1 + a12*b2;
  c[5] = a20*b0 + a21*b1 + a22*b2;

  b0 = b[6]; b1 = b[7]; b2 = b[8];
  c[6] = a00*b0 + a01*b1 + a02*b2;
  c[7] = a10*b0 + a11*b1 + a12*b2;
  c[8] = a20*b0 + a21*b1 + a22*b2;
};
/*global
  xwebgl
*/
//---------------------------------------------
// mat4
//---------------------------------------------
xwebgl.mat4 = {};

xwebgl.mat4.create_zero = function() {
  'use strict';
  return [
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0];
};

xwebgl.mat4.create_identity = function() {
  'use strict';
  return [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0];
};

xwebgl.mat4.assign_zero = function(a) {
  'use strict';
  a[0] = 0.0;  a[1] = 0.0;  a[2] = 0.0;  a[3] = 0.0;
  a[4] = 0.0;  a[5] = 0.0;  a[6] = 0.0;  a[7] = 0.0;
  a[8] = 0.0;  a[9] = 0.0;  a[10] = 0.0; a[11] = 0.0;
  a[12] = 0.0; a[13] = 0.0; a[14] = 0.0; a[15] = 0.0;
};

xwebgl.mat4.assign_identity = function(a) {
  'use strict';
  a[0] = 1.0;  a[1] = 0.0;  a[2] = 0.0;  a[3] = 0.0;
  a[4] = 0.0;  a[5] = 1.0;  a[6] = 0.0;  a[7] = 0.0;
  a[8] = 0.0;  a[9] = 0.0;  a[10] = 1.0; a[11] = 0.0;
  a[12] = 0.0; a[13] = 0.0; a[14] = 0.0; a[15] = 1.0;
};

xwebgl.mat4.assign = function(out, in_) {
  'use strict';
  out[0] = in_[0];  out[1] = in_[1];  out[2] = in_[2];  out[3] = in_[3];
  out[4] = in_[4];  out[5] = in_[5];  out[6] = in_[6];  out[7] = in_[7];
  out[8] = in_[8];  out[9] = in_[9];  out[10] = in_[10];  out[11] = in_[11];
  out[12] = in_[12];  out[13] = in_[13];  out[14] = in_[14];  out[15] = in_[15];
};

xwebgl.mat4.pack = function(out, in_) {
  'use strict';
  var v = in_[0];
  out[0] = v[0]; out[4] = v[1]; out[8] = v[2]; out[12] = v[3];
  v = in_[1];
  out[1] = v[0]; out[5] = v[1]; out[9] = v[2]; out[13] = v[3];
  v = in_[2];
  out[2] = v[0]; out[6] = v[1]; out[10] = v[2]; out[14] = v[3];
  v = in_[3];
  out[3] = v[0]; out[7] = v[1]; out[11] = v[2]; out[15] = v[3];
};

xwebgl.mat4.unpack = function(a) {
  'use strict';
  return [
    [a[0],a[4],a[8],a[12]],
    [a[1],a[5],a[9],a[13]],
    [a[2],a[6],a[10],a[14]],
    [a[3],a[7],a[11],a[15]] ];
};

xwebgl.mat4.mulMV = function( c, a, b ) {
  'use strict';
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  c[0] = a[0]*b0 + a[4]*b1 + a[ 8]*b2 + a[12]*b3;
  c[1] = a[1]*b0 + a[5]*b1 + a[ 9]*b2 + a[13]*b3;
  c[2] = a[2]*b0 + a[6]*b1 + a[10]*b2 + a[14]*b3;
  c[3] = a[3]*b0 + a[7]*b1 + a[11]*b2 + a[15]*b3;
};

xwebgl.mat4.mulMM = function( c, a, b ) {
  'use strict';
  var a00 = a[0], a01 = a[4], a02 = a[8],  a03 = a[12],
      a10 = a[1], a11 = a[5], a12 = a[9],  a13 = a[13],
      a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14],
      a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  c[0] = a00*b0 + a01*b1 + a02*b2 + a03*b3;
  c[1] = a10*b0 + a11*b1 + a12*b2 + a13*b3;
  c[2] = a20*b0 + a21*b1 + a22*b2 + a23*b3;
  c[3] = a30*b0 + a31*b1 + a32*b2 + a33*b3;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  c[4] = a00*b0 + a01*b1 + a02*b2 + a03*b3;
  c[5] = a10*b0 + a11*b1 + a12*b2 + a13*b3;
  c[6] = a20*b0 + a21*b1 + a22*b2 + a23*b3;
  c[7] = a30*b0 + a31*b1 + a32*b2 + a33*b3;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  c[ 8] = a00*b0 + a01*b1 + a02*b2 + a03*b3;
  c[ 9] = a10*b0 + a11*b1 + a12*b2 + a13*b3;
  c[10] = a20*b0 + a21*b1 + a22*b2 + a23*b3;
  c[11] = a30*b0 + a31*b1 + a32*b2 + a33*b3;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  c[12] = a00*b0 + a01*b1 + a02*b2 + a03*b3;
  c[13] = a10*b0 + a11*b1 + a12*b2 + a13*b3;
  c[14] = a20*b0 + a21*b1 + a22*b2 + a23*b3;
  c[15] = a30*b0 + a31*b1 + a32*b2 + a33*b3;
};

/**
  Euclidean rotation
  Computes MatrixExp[X], where
  X = {{0, -z, y, 0}, {z, 0, -x, 0}, {-y, x, 0, 0}, {0, 0, 0, 0}}.

  Algorithm:
  MatrixExp[X] = I + v X + u X.X, where
    t = Sqrt[x^2 + y^2 + z^2]
    u = (1 - Cos[t])/t^2
    v = Sin[t]/t
*/
xwebgl.mat4.rotation = function(m, w) {
  'use strict';
  var epsilon = 1e-8;
  var x = w[0];
  var y = w[1];
  var z = w[2];
  var t = x*x+y*y+z*z;
  if (t < epsilon) { xwebgl.mat4.assign_identity(m); return; }
  t = Math.sqrt(t);
  var u = (1.0 - Math.cos(t))/(t*t);
  var v = Math.sin(t)/t;

  m[0]=1.0-u*(y*y+z*z); m[4]=u*x*y-v*z;       m[ 8]=v*y+u*x*z;       m[12]=0.0;
  m[1]=u*x*y+v*z;       m[5]=1.0-u*(x*x+z*z); m[ 9]=u*y*z-v*x;       m[13]=0.0;
  m[2]=u*x*z-v*y;       m[6]=u*y*z+v*x;       m[10]=1.0-u*(x*x+y*y); m[14]=0.0;
  m[3]=0.0;             m[7]=0.0;             m[11]=0.0;             m[15]=1.0;
};

/**
  Translation in R^3

  Computes MatrixExp[X], where
  X = {{0, 0, 0, x}, {0, 0, 0, y}, {0, 0, 0, z}, {0, 0, 0, 0}}.
*/
xwebgl.mat4.translationR = function(m, w) {
  'use strict';
  m[0]=1.0; m[4]=0.0; m[ 8]=0.0; m[12]=w[0];
  m[1]=0.0; m[5]=1.0; m[ 9]=0.0; m[13]=w[1];
  m[2]=0.0; m[6]=0.0; m[10]=1.0; m[14]=w[2];
  m[3]=0.0; m[7]=0.0; m[11]=0.0; m[15]=1.0;
};

/**
  Translation in S^3

  Computes MatrixExp[X], where
  X = {{0, 0, 0, x}, {0, 0, 0, y}, {0, 0, 0, z}, {-x, -y, -z, 0}}.

  Algorithm:
  MatrixExp[X] = I + v X + u X.X, where
    t = Sqrt[x^2 + y^2 + z^2]
    u = (1 - Cos[t])/t^2
    v = Sin[t]/t
*/
xwebgl.mat4.translationS = function(m, w) {
  'use strict';
  var epsilon = 1e-8;
  var x = w[0];
  var y = w[1];
  var z = w[2];
  var t = x*x+y*y+z*z;
  if (t < epsilon) { xwebgl.mat4.assign_identity(m); return; }
  t = Math.sqrt(t);
  var u = (1.0 - Math.cos(t))/(t*t);
  var v = Math.sin(t)/t;

  m[0]=1.0-u*x*x; m[4]=-u*x*y;    m[ 8]=-u*x*z;    m[12]=v*x;
  m[1]=-u*x*y;    m[5]=1.0-u*y*y; m[ 9]=-u*y*z;    m[13]=v*y;
  m[2]=-u*x*z;    m[6]=-u*y*z;    m[10]=1.0-u*z*z; m[14]=v*z;
  m[3]=-v*x;      m[7]=-v*y;      m[11]=-v*z;      m[15]=1-u*t*t;
};

/**
  Translation in H^3

  Computes MatrixExp[X], where
  X = {{0, 0, 0, x}, {0, 0, 0, y}, {0, 0, 0, z}, {x, y, z, 0}}.

  Algorithm:
  MatrixExp[X] = I + v X + u X.X, where
    t = Sqrt[x^2 + y^2 + z^2]
    u = (Cosh[t] - 1)/t^2
    v = Sinh[t]/t
*/
xwebgl.mat4.translationH = function(m, w) {
  'use strict';
  var epsilon = 1e-8;
  var x = w[0];
  var y = w[1];
  var z = w[2];
  var t = x*x+y*y+z*z;
  if (t < epsilon) { xwebgl.mat4.assign_identity(m); return; }
  t = Math.sqrt(t);
  var u = (Math.cosh(t) - 1.0)/(t*t);
  var v = Math.sinh(t)/t;

  m[0]=1.0+u*x*x; m[4]=u*x*y;     m[ 8]=u*x*z;     m[12]=v*x;
  m[1]=u*x*y;     m[5]=1.0+u*y*y; m[ 9]=u*y*z;     m[13]=v*y;
  m[2]=u*x*z;     m[6]=u*y*z;     m[10]=1.0+u*z*z; m[14]=v*z;
  m[3]=v*x;       m[7]=v*y;       m[11]=v*z;       m[15]=1+u*t*t;
};

/**
  Camera transform.

  rectangle = [x0, x1, y0, y1, z]
  [x0, y0, z], [x0, y1, z], [x1, y0, z], [x0, y1, z] are four corners of a rectangle
  parallel to the bases of the frustrum with edges on the boundary of the frustrum.

  zplane = [z0, z1]
  z0 and z1 are the z-coordinates of the near and far clip planes.

  camera position = [px, py, pz, pw]
  the camera position is in homogeneous coordinates.
*/
xwebgl.mat4.camera = function(
  out,
  // rectangle at distance z
  rectangle,
  // near and far parallel planes
  zplane,
  camera )
{
  'use strict';

  var x0 = rectangle[0];
  var x1 = rectangle[1];
  var y0 = rectangle[2];
  var y1 = rectangle[3];
  var z  = rectangle[4];

  var z0 = zplane[0];
  var z1 = zplane[1];

  var px = camera[0];
  var py = camera[1];
  var pz = camera[2];
  var pw = camera[3];

  var dx = 0.5 * ( x1 - x0 );
  var dy = 0.5 * ( y1 - y0 );
  var dz = 0.5 * ( z1 - z0 );

  var sx = 0.5 * ( x1 + x0 );
  var sy = 0.5 * ( y1 + y0 );
  var sz = 0.5 * ( z1 + z0 );

  // row 0
  out[ 0] = -( z * pw - pz ) / dx;
  out[ 4] = 0.0;
  out[ 8] = ( sx * pw - px ) / dx;
  out[12] = -( sx * pz - z * px ) / dx;

  // row 1
  out[ 1] = 0.0;
  out[ 5] = -( z * pw - pz ) / dy;
  out[ 9] = ( sy * pw - py ) / dy;
  out[13] = -( sy * pz - z * py ) / dy;

  // row 2
  out[ 2] = 0.0;
  out[ 6] = 0.0;
  out[10] = -( sz * pw - pz ) / dz;
  out[14] = -( sz * pz - z0 * z1 * pw ) / dz;

  // row 3
  out[ 3] = 0.0;
  out[ 7] = 0.0;
  out[11] = -pw;
  out[15] = pz;
};
/*global
  xwebgl
*/
xwebgl.compile = function(gl, type, src) {
  'use strict';
  var shader = gl.createShader(type);
  if (!shader) {
    throw Error('failed to make shader');
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  // check error
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var t;
    switch (type) {
    case gl.VERTEX_SHADER:
      t = 'vertex';
      break;
    case gl.FRAGMENT_SHADER:
      t = 'fragment';
      break;
    }
    throw Error(': failed to compile ' + t + ' shader:' +
                gl.getShaderInfoLog(shader));
  }
  return shader;
};

//------------------------------------------------------
// Shader
//------------------------------------------------------
xwebgl.Shader = function(gl, type, initial_src) {
  'use strict';
  var shader = null;

  function dispose() {
    if (!shader) {
      return;
    }
    gl.deleteShader(shader);
    shader = null;
  }

  function compile(src) {
    dispose();
    shader = xwebgl.compile(gl, src, type);
  }

  if (initial_src) {
    compile(initial_src);
  }

  return {compile : compile, shader : function() { return shader; }};
};
/*global
  xwebgl
*/
xwebgl.link = function(gl, shaders) {
  'use strict';
  var program = gl.createProgram();
  if (!program) {
    throw Error('failed to create shader program');
  }

  // attach
  for (var i = 0; i !== shaders.length; ++i) {
    gl.attachShader(program, shaders[i]);
  }

  gl.linkProgram(program);

  // check error
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw Error('failed to link shaders');
  }
  return program;
};

xwebgl.uniform_setter = function(gl, type, loc) {
  'use strict';

  function flatten(_) { return [].concat.apply([], _); }

  // safari does not support Array.from()
  function to_array(_) {
    var out = Array();
    for (var i = 0; i !== _.length; ++i) {
      out.push( _[i] );
    }
    return out;
  }

  var functions = {
    // bool
    0x8B56: function(_) { gl.uniform1b(loc, _); },
    // bvec2
    0x8B57: function(_) { gl.uniform2bv(loc, flatten(_)); },
    // bvec3
    0x8B58: function(_) { gl.uniform3bv(loc, flatten(_)); },
    // bvec4
    0x8B59: function(_) { gl.uniform4bv(loc, flatten(_)); },
    // int
    0x1404: function(_) { gl.uniform1i(loc, _); },
    // ivec2
    0x8B53: function(_) { gl.uniform2iv(loc, flatten(_)); },
    // ivec3
    0x8B54: function(_) { gl.uniform3iv(loc, flatten(_)); },
    // ivec4
    0x8B55: function(_) { gl.uniform4iv(loc, flatten(_)); },
    // float
    0x1406: function(_) { gl.uniform1f(loc, _); },
    // vec2
    0x8B50: function(_) { gl.uniform2fv(loc, flatten(_)); },
    // vec3
    0x8B51: function(_) { gl.uniform3fv(loc, flatten(_)); },
    // vec4
    0x8B52: function(_) { gl.uniform4fv(loc, flatten(_)); },
    // mat2
    0x8B5A: function(_) { gl.uniformMatrix2fv(loc, false, to_array(_)); },
    // mat3
    0x8B5B: function(_) { gl.uniformMatrix3fv(loc, false, to_array(_)); },
    // mat4
    0x8B5C: function(_) { gl.uniformMatrix4fv(loc, false, to_array(_)); },
    // sampler2D
    0x8B5E: function(_) { gl.uniform1i(loc, _); },
    // samplerCube
    0x8B60: function(_) { gl.uniform1i(loc, _); }
  };
  return functions[type];
};

xwebgl.introspect_NEW = function(gl, program) {
  'use strict';

  var i;
  var x;
  var name;

  // map attribute name -> attribute location
  var attribute = {};
  var attribute_count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (i = 0; i !== attribute_count; ++i) {
    x = gl.getActiveAttrib(program, i);
    name = x.name.replace(/\[\d+\]$/, '');
    attribute[name] = gl.getAttribLocation(program, name);
  }

  // map uniform name -> uniform setter
  var uniform = {};
  var uniform_count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (i = 0; i !== uniform_count; ++i) {
    x = gl.getActiveUniform(program, i);
    name = x.name.replace(/\[\d+\]$/, '');
    var loc = gl.getUniformLocation(program,name);

    uniform[name] = xwebgl.uniform_setter(gl,x.type, loc);
  }
  return { attributes : attribute, uniforms : uniform };
};


xwebgl.introspect_NEW = function(gl, program) {
  'use strict';

  var i;
  var x;
  var name;

  // map attribute name -> attribute location
  var attribute = {};
  var attribute_count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (i = 0; i !== attribute_count; ++i) {
    x = gl.getActiveAttrib(program, i);
    name = x.name.replace(/\[\d+\]$/, '');
    attribute[name] = gl.getAttribLocation(program, name);
  }

  // map uniform name -> uniform setter
  var uniform = {};
  var uniform_count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (i = 0; i !== uniform_count; ++i) {
    x = gl.getActiveUniform(program, i);
    name = x.name.replace(/\[\d+\]$/, '');
    var loc = gl.getUniformLocation(program, name);
    uniform[name] = xwebgl.uniform_setter(gl, x.type, loc);
  }
  return {attributes : attribute, uniforms : uniform};
};

/**
  Calls getAttributeLocation() and getUniformLocation() on
  explicitly provided list of attributes and uniforms.

  Safari 6.2.8:
     WebGLActiveInfo.name returns an encoded name, not the real name,
     making getActiveAttrib() / getUniformLocation() useless for introspection.
     This workaround provides the attributes and uniforms explicitly.
*/
xwebgl.introspect = function(gl, program, attribute_list, uniform_list) {
  'use strict';

  var types = {
  'vec2' : 0x8B50,
  'vec3' : 0x8B51,
  'vec4' : 0x8B52,
  'ivec2' : 0x8B53,
  'ivec3' : 0x8B54,
  'ivec4' : 0x8B55,
  'bool' : 0x8B56,
  'bvec2' : 0x8B57,
  'bvec3' : 0x8B58,
  'bvec4' : 0x8B59,
  'mat2' : 0x8B5A,
  'mat3' : 0x8B5B,
  'mat4' : 0x8B5C,
  'sampler2D' : 0x8B5E,
  'samplerCube' : 0x8B60,
  'int8' : 0x1400,
  'uint8' : 0x1401,
  'int16' : 0x1402,
  'uint16' : 0x1403,
  'int32' : 0x1404,
  'uint32' : 0x1405,
  'float' : 0x1406
};

  var attribute = {};
  for (var i = 0; i !== attribute_list.length; ++i) {
    var name = attribute_list[i].name;
    var type = types[attribute_list[i].type];
    var loc = gl.getAttribLocation(program, name);
    if (loc !== -1) {
      attribute[name] = loc;
    }
  }

  var uniform = {};
  for (i = 0; i !== uniform_list.length; ++i) {
    var name = uniform_list[i].name;
    var type = types[uniform_list[i].type];
    var loc = gl.getUniformLocation(program, name);
    if (loc) {
      uniform[name] = xwebgl.uniform_setter(gl, type, loc);
    }
  }

  return {attributes : attribute, uniforms : uniform};
};



//------------------------------------------------------
// Program
//------------------------------------------------------
xwebgl.Program = function(gl, initial_shaders, attributes, uniforms) {
  'use strict';

  var program = null;
  var info;

  function dispose() {
    if (!program) {
      return;
    }
    gl.deleteProgram(program);
  }

  function link(shaders) {

    dispose();

    //var q = shaders.map(function(_) { return _.shader(); });
    program = xwebgl.link(gl, shaders);

    info = xwebgl.introspect(gl, program, attributes, uniforms);
  }

  if (initial_shaders) {
    link(initial_shaders);
  }

  function enable() { gl.useProgram(program); }
  function disable() { gl.useProgram(null); }

  function set_uniforms(values) {
    Object.keys(values).forEach(function(_) {
      var setter = info.uniforms[_];
      if (setter) {
	setter(values[_]);
      }
    });
  }

  return {
    link : link,
    enable : enable,
    disable : disable,
    attributes: info.attributes,
    uniforms: info.uniforms,
    set_uniforms: set_uniforms,
    dispose : dispose
  };
};
/*global
  xwebgl
*/
//----------------------------------------------------
// Texture
//----------------------------------------------------
xwebgl.Texture = function(gl, initial_image ) {
  'use strict';
  var TARGET = gl.TEXTURE_2D;
  var UNIT = gl.TEXTURE0;
  var texture;

  function dispose() {
    if (!texture) {
      return;
    }
    gl.deleteTexture(texture);
    texture = null;
  }

  function load(image) {
    dispose();
    texture = gl.createTexture();
    gl.bindTexture(TARGET, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(TARGET, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(TARGET, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(TARGET, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(TARGET);
    gl.bindTexture(TARGET, null);
  }

  if (initial_image) { load(initial_image); }

  function enable() {
    if (!texture) {
      return;
    }
    gl.activeTexture(UNIT);
    gl.bindTexture(TARGET, texture);
    // callback(UNIT);
    // return true;
  }

  function disable() {
    gl.activeTexture(UNIT);
    gl.bindTexture(TARGET, null);
  }

  return {load : load, enable : enable, disable : disable, dispose : dispose};
};

//----------------------------------------------------
// Cubemap
//----------------------------------------------------
xwebgl.Cubemap = function(gl, initial_image ) {
  'use strict'
  ;
  var TARGET = gl.TEXTURE_CUBE_MAP;
  var UNIT = gl.TEXTURE1;
  var texture;

  function dispose() {}

  function load(image) {
    dispose();
    // texture
    texture = gl.createTexture();

    gl.bindTexture(TARGET, texture);

    gl.texParameteri(TARGET, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(TARGET, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(TARGET, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(TARGET, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    for (var i = 0; i !== 6; ++i) {
      var face = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
      gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image[i]);
    }

    gl.bindTexture(TARGET, null);
  }

  if (initial_image) {
    load(initial_image);
  }

  function enable() {
    if (!texture) {
      return false;
    }
    gl.activeTexture(UNIT);
    gl.bindTexture(TARGET, texture);
    return true;
  }

  function disable() { gl.bindTexture(TARGET, null); }

  function dispose() {
    if (!texture) {
      return;
    }
    gl.deleteTexture(texture);
    texture = null;
  }

  return {load : load, enable : enable, disable : disable, dispose : dispose};
};
/*global
  xwebgl
*/

//----------------------------------------------------
// VertexBuffer
//----------------------------------------------------
xwebgl.VertexBuffer = function(gl) {
  'use strict';
  var data;
  var ext = xwebgl.getExtension(gl,'ANGLE_instanced_arrays');

  function dispose() {
    if (data) {
      gl.deleteBuffer(data.buffer);
      data = null;
    }
  }

  function load(vertex, attribute) {
    var numbertype = {'float32': gl.FLOAT};

    dispose();
    // create a new buffer
    var buffer = gl.createBuffer();
    if (!buffer) {
      throw Error('failed to gl create buffer');
    }

    // upload the data
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertex.data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // compute packing
    var total_blocksize = 0;
    var i;
    for (i = 0; i !== vertex.packing.length; ++i) {
      total_blocksize += vertex.packing[i].stride;
    }
    var SIZEOF_FLOAT32 = 4;

    var packing = [];
    var offset = 0;
    if ('divisor' in vertex) {
      var divisor = vertex.divisor; }
    else {
      divisor = 1;
    }

    for (i = 0; i !== vertex.packing.length; ++i) {
      var q;

      // skip if the shader does not have the attribute
      var key = vertex.packing[i].name;
      if ( !(key in attribute) || attribute[key] === -1 || attribute[key] === undefined) {
        continue;
      }

      var blocksize = vertex.packing[i].stride;
      if (blocksize > 4)
      {
	// pack blocks of 4
	for (var n = 0; n !== blocksize; n += 4) {
          q = {
            attribute : attribute[key] + n/4,
            blocksize : 4,
            numbertype : numbertype[vertex.packing[i].type],
            normalized : false,
            byte_blocksize : total_blocksize * SIZEOF_FLOAT32,
            byte_offset : offset * SIZEOF_FLOAT32,
	    divisor : divisor
          };
          packing.push(q);
          offset += 4;
	}
      }
      else
      {
        q = {
          attribute : attribute[key],
          blocksize : blocksize,
          numbertype : gl.FLOAT,
          normalized : false,
          byte_blocksize : total_blocksize * SIZEOF_FLOAT32,
          byte_offset : offset * SIZEOF_FLOAT32,
	  divisor : divisor
        };
        packing.push(q);
	offset += blocksize;
      }
    }
    data = {buffer : buffer, packing : packing};
  }

  function enable() {
    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);

    for (var i = 0; i !== data.packing.length; ++i) {
      var v = data.packing[i];
      gl.enableVertexAttribArray(v.attribute);
      gl.vertexAttribPointer(v.attribute, v.blocksize, v.numbertype,
                             v.normalized, v.byte_blocksize, v.byte_offset);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  function enable_instanced() {
    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);

    for (var i = 0; i !== data.packing.length; ++i) {
      var v = data.packing[i];
      gl.enableVertexAttribArray(v.attribute);
      gl.vertexAttribPointer(v.attribute, v.blocksize, v.numbertype,
                             v.normalized, v.byte_blocksize, v.byte_offset);
      ext.vertexAttribDivisorANGLE(v.attribute, v.divisor);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  function disable() {
    for (var i = 0; i !== data.packing.length; ++i) {
      var v = data.packing[i];
      gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
      gl.disableVertexAttribArray(v.attribute);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }

  return {
    load : load,
    enable : enable,
    enable_instanced : enable_instanced,
    disable : disable,
    dispose : dispose
  };
};

//----------------------------------------------------
// IndexBuffer
//----------------------------------------------------
xwebgl.IndexBuffer = function(gl) {
  'use strict';
  var data;
  var ext = xwebgl.getExtension(gl,'ANGLE_instanced_arrays');

  function dispose() {
    if (data) {
      gl.deleteBuffer(data.buffer);
      data = null;
    }
  }

  var mode = {
    'points': gl.POINTS,
    'line_strip': gl.LINE_STRIP,
    'line_loop':gl.LINE_LOOP,
    'lines':gl.LINES,
    'triangle_strip':gl.TRIANGLE_STRIP,
    'triangle_fan':gl.TRIANGLE_FAN,
    'triangles':gl.TRIANGLES };

  function load(x) {
    dispose();
    // create a new buffer
    var buffer = gl.createBuffer();
    if (!buffer) {
      throw Error('failed to gl create buffer');
    }

    // upload the data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, x.data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    var numbertype = {'uint8': gl.UNSIGNED_BYTE, 'uint16':gl.UNSIGNED_SHORT};

    data = {
      buffer : buffer,
      drawmode : mode[x.mode],
      index_count : x.data.length,
      numbertype : numbertype[x.type],
      offset : 0
    };
  }

  function draw() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.buffer);
    gl.drawElements(data.drawmode, data.index_count, data.numbertype,
                    data.offset);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  function draw_instanced(instance_count) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.buffer);
    ext.drawElementsInstancedANGLE(data.drawmode, data.index_count,
                                   data.numbertype, data.offset,
                                   instance_count);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  return {
    load : load,
    draw : draw,
    draw_instanced : draw_instanced,
    dispose : dispose
  };
};
/*global
  xwebgl
*/

//----------------------------------------------------
// SurfaceDrawer
//----------------------------------------------------
xwebgl.SurfaceDrawer = function(gl, shader) {
  'use strict';

  var vertex_buffer = xwebgl.VertexBuffer(gl);
  var index_buffer = xwebgl.IndexBuffer(gl);

  function dispose() {
    vertex_buffer.dispose();
    index_buffer.dispose();
  }

  function load(surface) {
    vertex_buffer.load(surface.vertex, shader.attributes);
    index_buffer.load(surface.element);
  }

  function draw() {
    vertex_buffer.enable();
    index_buffer.draw();
    vertex_buffer.disable();
  }

  return {load : load, update : draw, dispose : dispose};
};

//----------------------------------------------------
// MultiSurfaceDrawer
//----------------------------------------------------
xwebgl.MultiSurfaceDrawer = function(gl, shader) {
  'use strict';
  var vertex_buffer = xwebgl.VertexBuffer(gl);
  var index_buffer = xwebgl.IndexBuffer(gl);
  var transform = [];

  function load_transforms(surface) {
    if (surface.transform.data.length % 18 !== 0) {
      throw Error('transform data length ' + surface.transform.data.length +
                  ' not divisible by stride 18');
    }
    for (var i = 0; i < surface.transform.data.length; i += 18) {
      transform.push({
        transform : surface.transform.data.subarray(i, i + 16),
        orientation : surface.transform.data.subarray(i + 16, i + 18)
      });
    }
  }

  function draw() {
    vertex_buffer.enable();
    for (var i = 0; i !== transform.length; ++i) {
      var t = transform[i];
      shader.uniforms.instance_transform(t.transform);
      shader.uniforms.instance_orientation(t.orientation);
      index_buffer.draw();
    }
    vertex_buffer.disable();
  }

  function load(surface) {
    vertex_buffer.load(surface.vertex, shader.attributes);
    index_buffer.load(surface.element);
    load_transforms(surface);
  }

  return {load : load, update : draw, dispose : function() {} };
};

//----------------------------------------------------
// InstancedSurfaceDrawer
//----------------------------------------------------
xwebgl.InstancedSurfaceDrawer = function(gl, shader) {
  'use strict';
  var vertex_buffer = xwebgl.VertexBuffer(gl);
  var transform_buffer = xwebgl.VertexBuffer(gl);
  var color_buffer = xwebgl.VertexBuffer(gl);
  var index_buffer = xwebgl.IndexBuffer(gl);
  var instance_count;

  function dispose() {
    vertex_buffer.dispose();
    transform_buffer.dispose();
    index_buffer.dispose();
  }

  function load(surface) {
    /*
    //------
    // FIX renaming
    surface.transform.instance_transform = surface.transform.transform;
    delete surface.transform.transform;

    surface.transform.instance_orientation = surface.transform.orientation;
    delete surface.transform.orientation;
    //----
*/
    //------
    // FIX renaming
    surface.transform.packing[0].name = 'instance_transform';
    surface.transform.packing[1].name = 'instance_orientation';
    surface.color.packing[0].name = 'instance_color';
    //------

    vertex_buffer.load(surface.vertex, shader.attributes);
    index_buffer.load(surface.element);
    transform_buffer.load(surface.transform, shader.attributes);
    color_buffer.load(surface.color, shader.attributes);

    // compute instance_count
    var n = 0;
    for (var i = 0; i !== surface.transform.packing.length; ++i) {
      n += surface.transform.packing[i].stride;
    }
    instance_count = surface.transform.data.length / n;
  }

  function draw() {
    vertex_buffer.enable();
    transform_buffer.enable_instanced();
    color_buffer.enable_instanced();

    index_buffer.draw_instanced(instance_count);

    //instance_color_buffer.disable();
    transform_buffer.disable();
    vertex_buffer.disable();
  }

  return {load : load, update : draw, dispose : dispose};
};

//----------------------------------------------------
// make_drawer
//----------------------------------------------------
xwebgl.make_drawer = function(gl, shader, surface) {
  'use strict';

  var drawer;
  if ('transform' in surface) {
    var instanced = Boolean(xwebgl.getExtension(gl,'ANGLE_instanced_arrays'));
    //instanced = false;

    if (instanced) {
      drawer = xwebgl.InstancedSurfaceDrawer(gl, shader);
    } else {
      drawer = xwebgl.MultiSurfaceDrawer(gl, shader);
    }
  } else {
    drawer = xwebgl.SurfaceDrawer(gl, shader);
  }
  drawer.load(surface);
  return drawer;
};

//----------------------------------------------------
// DrawerCache
//----------------------------------------------------
xwebgl.DrawerCache = function(gl) {
  'use strict';

  var surface = [];
  var drawer = [];

  function set_surface(i, s) {
    surface[i] = s;
  }

  function get_surface(i) {
    return surface[i];
  }

  function get_drawer(i, shader) {
    // note: locked to first shader
    if ( typeof drawer[i] === 'undefined' ) {
      drawer[i] = xwebgl.make_drawer(gl, shader, surface[i]);
    }
    return drawer[i];
  }

  return { set_surface: set_surface, get_surface : get_surface, get_drawer: get_drawer};
};

export {xwebgl};