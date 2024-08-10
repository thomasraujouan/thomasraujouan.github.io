#version 300 es

// An attribute is an input (in) to a vertex shader.
// it will receive data from a buffer
in vec4 a_position;
// in vec4 a_color;
in vec3 a_normal;

// Uniforms are the same for every pass of the buffer
// The model matrix
uniform mat4 u_viewinvtrans;
// // A matrix to transform the positions by
// uniform mat4 u_mvp;
// A matrix to transform the positions by
uniform mat4 u_vpMatrix;
// A Moebius matrix to transform the positions by
uniform mat4 u_moebius;
// The model matrix of the piece drawn
uniform mat4 u_modelMatrix;

// Varyings are outputs (out) 
// that will be passed to the fragment shader
out vec4 v_color;
out vec3 v_normal;

// stereographic projection, last coord is 1
vec4 stereo(vec4 v) {
  float d = 1.0 - v.w;
  return vec4(v.x/d, v.y/d, v.z/d, 1.0);
}

// Differential of anti-stereographic projection
// Meant to lift the normals to R^4
vec4 diffAntiStereo(vec3 p, vec3 v) {
  float n2 = p.x*p.x + p.y*p.y + p.z*p.z;
  float denom = (1.0 + n2) * (1.0 + n2);
  vec4 a = vec4(2.0 * (1.0 + n2 - 2.0 * p.x * p.x), - 4.0 * p.x * p.y, - 4.0 * p.x * p.z, 4.0 * p.x)/denom;
  vec4 b = vec4(- 4.0 * p.x * p.y, 2.0 * (1.0 + n2 - 2.0 * p.y * p.y),  - 4.0 * p.y * p.z, 4.0 * p.y)/denom;
  vec4 c = vec4(- 4.0 * p.x * p.z, - 4.0 * p.y * p.z, 2.0 * (1.0 + n2 - 2.0 * p.z * p.z), 4.0 * p.z)/denom;
  float x = a.x * v.x + b.x * v.y + c.x * v.z;
  float y = a.y * v.x + b.y * v.y + c.y * v.z;
  float z = a.z * v.x + b.z * v.y + c.z * v.z;
  float w = a.w * v.x + b.w * v.y + c.w * v.z;
  return vec4(x, y, z, w);
}

// Differential of stereographic projection
// Meant to push the normals to R^3
vec3 diffStereo(vec4 p, vec4 v) {
  float denom1 = 1.0 - p.w;
  float denom2 = denom1 * denom1;
  float x = v.x / denom1 + v.w * p.x / denom2;
  float y = v.y / denom1 + v.w * p.y / denom2;
  float z = v.z / denom1 + v.w * p.z / denom2;
  return vec3(x, y, z);
}

// Projective space
vec3 project(vec4 v) {
  float x = v.x / v.w;
  float y = v.y / v.w;
  float z = v.z / v.w;
  return vec3(x,y,z);
}

// all shaders have a main function
void main() {
  // Apply symmetry
  vec4 worldPosition = u_modelMatrix * a_position;
  // TODO: This line may introduce bugs if there is a translation part?
  vec3 worldNormal = mat3(u_modelMatrix) * a_normal; 
  // Apply the Moebius transformation and project to R^3
  vec4 moebiusedPosition = u_moebius *  worldPosition;
  vec4 position =  stereo(moebiusedPosition);

  // Multiply the position by the VP matrix.
  gl_Position = u_vpMatrix * position;

  // Orient the normal and pass it to the fragment shader
  // We lift, Moebius, and project back before applying the normal matrix
  vec4 liftNormal = diffAntiStereo(stereo(worldPosition).xyz, worldNormal);
  liftNormal = u_moebius * liftNormal;
  v_normal = diffStereo(moebiusedPosition, liftNormal);
  // TODO: This line may introduce bugs if there is a translation part?
  v_normal =   mat3(u_viewinvtrans) * v_normal  ;
}