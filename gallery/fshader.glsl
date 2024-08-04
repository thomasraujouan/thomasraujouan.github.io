#version 300 es

precision highp float;

// the varied normal passed from the vertex shader
in vec3 v_normal;

uniform vec3 u_lightDirection;
uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);
 
  // compute the light by taking the dot product
  // of the normal to the light's reverse direction
  // we won't see back faces, so by taking the absolute value
  // we spare the trouble of computing the oriantation of the face.
  float light = abs(dot(normal, u_lightDirection));
 
  outColor = u_color;
  
  // Lets multiply just the color portion (not the alpha)
  // by the light
  outColor.rgb *= light;
  }