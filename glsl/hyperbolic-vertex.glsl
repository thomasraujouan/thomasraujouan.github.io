uniform float time;
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