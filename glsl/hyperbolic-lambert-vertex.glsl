#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
varying vec3 vLightBack;
varying vec3 vIndirectBack;
#endif

uniform float time;
uniform mat4 lorentzMatrix;

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
// vec4 antiStereographicProjection(vec3 p) {
//     float norm2 = p.x * p.x + p.y * p.y + p.z * p.z;
//     float t = (1.0 + norm2) / (1.0 - norm2);
//     vec3 v = 2.0 * p / (1.0 - norm2);
//     return vec4(t, v.x, v.y, v.z);
// }
// vec3 stereographicProjection(vec4 p) {
//     float denominator = 1.0 + p.x;
//     return vec3(p.y, p.z, p.w) / denominator;
// }
vec3 hyperbolicMovement(vec3 p) {
	vec4 v = antiStereographicProjection(p);
	v = lorentzMatrix * v;
	return stereographicProjection(v);
}

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
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
	vec3 transformed = hyperbolicMovement(position);
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}