uniform float time;
uniform float lorentzX;
uniform float lorentzY;
uniform float lorentzZ;
uniform mat4 lorentzMatrix;

#define NORMAL

#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
varying vec3 vViewPosition;
#endif

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
    vec4 c1 = vec4(cosh(a), sinh(a), 0.0, 0.0);
    vec4 c2 = vec4(sinh(a), cosh(a), 0.0, 0.0);
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
    v = lorentzMatrix * v;
    return stereographicProjection(v);
}

#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
    vec3 transformed = hyperbolicMovement(position);
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
    vViewPosition = -mvPosition.xyz;
	#endif
}