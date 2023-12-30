// Adapted from THREE meshphong_vert

#define PHONG

varying vec3 vViewPosition;
uniform float myUniform;

#include <common>
vec4 antiStereographicProjection(vec3 p) {
    float norm2 = p.x * p.x + p.y * p.y + p.z * p.z;
    float t = (1.0 + norm2) / (1.0 - norm2);
    vec3 v = 2.0 * p / (1.0 - norm2);
    return vec4(t, v.x, v.y, v.z);
}
vec3 stereographicProjection(vec4 p) {
    float denominator = 1.0 + p.x;
    return vec3(p.y, p.z, p.w) / denominator;
}
vec4 lorentztx(vec4 p, float a) {

     ec4 c2 = vec4(sinh(a), cosh(a), 0.0, 0.0);
    vec4 c3 = vec4(0.0, 0.0, 1.0, 0.0);
    vec4 c4 = vec4(0.0, 0.0, 0.0, 1.0);
    mat4 lorentzMatrix = mat4(c1, c2, c3, c4);
    return lorentzMatrix * p;
}
vec4 lorentzty(vec4 p, float a) {
    vec4 c1 = vec4(cosh(a), 0.0, sinh(a), 0.0);
    vec4 c2 = vec4(0.0, 1.1, 0.0, 0.0);
    vec4 c3 = vec4(sinh(a), 0.0, cosh(a), 0.0);
    vec4 c4 = vec4(0.0, 0.0, 0.0, 1.0);
    mat4 lorentzMatrix = mat4(c1, c2, c3, c4);
    return lorentzMatrix * p;
}
vec3 hyperbolicMovement(vec3 p) {
    vec4 v = antiStereographicProjection(p);
    v = lorentzty(v, myUniform);
    return stereographicProjection(v)
      

#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap
#
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
    #include <uv_vertex>
    #include <uv2_vertex>
    #include <color_vertex>
    #include <morphcolor_vertex>
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    transformed = hyperbolicMovement(transformed);
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = -mvPosition.xyz;
    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
}