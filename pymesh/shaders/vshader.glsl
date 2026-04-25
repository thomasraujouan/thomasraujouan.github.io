attribute vec4 position;
attribute vec4 normal;
attribute vec2 texture;

#if INSTANCE == 1
    uniform mat4 instance_transform;
    uniform vec2 instance_orientation;
    uniform vec4 instance_color;
#endif
#if INSTANCE == 2
    attribute mat4 instance_transform;
    attribute vec2 instance_orientation;
    attribute vec4 instance_color;
#endif

uniform mat4 object_transform;
uniform mat4 camera_transform;

varying vec4 x_position;
varying vec3 x_normal;
varying vec2 x_texture;
varying vec4 x_color;
varying float x_orientation;

vec3 normalized_difference(vec4 a, vec4 b) {
    return a.xyz * b.w - b.xyz * a.w;
}

#if GEOMETRY == 0
    void compute(mat4 T) {
        x_position = T * position;
        x_normal = normalize((T * vec4(normal.xyz, 0.0)).xyz);
    }
#endif
#if GEOMETRY == 1
    void compute(mat4 T) {
        vec4 P = T * position;
        P.w += 1.0;
        vec4 N = T * normal;
        x_position = P;
        x_normal = normalized_difference(P, N);
    }
#endif

void main() {
    #if INSTANCE > 0
            compute(object_transform * instance_transform);
            x_normal *= instance_orientation[0];
            x_orientation = 0.5 * (1.0 - instance_orientation[1]);
    #else
        compute(object_transform);
    #endif
    x_texture = texture;
    x_color = instance_color;
    gl_Position = camera_transform * x_position;
}