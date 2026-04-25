#if TEX==1
  #extension GL_OES_standard_derivatives : enable
#endif

varying vec4 x_position;
varying vec3 x_normal;
varying vec2 x_texture;
varying vec4 x_color;
varying float x_orientation;

uniform vec4 camera_position;

uniform vec4 light_position[LIGHT_COUNT];
uniform vec4 diffuse_light_color[LIGHT_COUNT];
uniform vec4 specular_light_color[LIGHT_COUNT];

uniform float diffuse_factor;
uniform float specular_factor;

uniform vec3 fgcolor[2];
uniform vec2 color_scale;

uniform vec4 specular_color[2];

uniform vec2 grid_frequency[2];
uniform vec2 grid_width[2];

vec3 normalized_difference_(vec4 a, vec4 b) {
    return normalize(b.xyz * a.w - a.xyz * b.w);
}

float diffuse_fn(vec3 signed_normal, vec3 light_vector) {
    float t = dot(signed_normal, light_vector);
    float q = 1.0 + 2.0 * diffuse_factor * (1.0 - t);
    return (1.0 + t) * (1.0 + t) / (1.0 + 2.0 * t + q * q);
}

float specular_fn(vec3 signed_normal, vec3 light_vector, vec3 camera_vector) {
    vec3 R = reflect(-light_vector, signed_normal);
    float d = dot(camera_vector, R);
    float q = acos(d) / specular_factor;
    return exp(-q * q);
}

//vec3 hsv2rgb(vec3 c)
//{
//  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
//}

#if TEX==1
    float grid_fn(vec2 frequency, vec2 width) {
        vec2 m = 2.0 * fwidth(frequency * x_texture);
        vec2 tex = fract(frequency * x_texture);
        tex = 1.0 - abs(2.0 * tex - 1.0);
        vec2 factor = smoothstep(m * (width - 1.0), m * (width + 1.0), tex);
        return min(factor.x, factor.y);
    }
    void compute_color(out vec4 color[2]) {
        for(int i = 0; i != 2; ++i) {
            float g = grid_fn(grid_frequency[i], grid_width[i]);

            //vec3 bgcolor = hsv2rgb(vec3(color_spec[i].x*x_color+color_spec[i].y, color_spec[i].z, color_spec[i].w));
            //color[i] = vec4( mix( fgcolor[i], bgcolor, g), 1.0);
            color[i] = vec4(mix(fgcolor[i], color_scale[i] * x_color.rgb, g), 1.0);
        }
    }
#else
    void compute_color(out vec4 color[2]) {
        for(int i = 0; i != 2; ++i) {
        //vec3 bgcolor = hsv2rgb(vec3(color_spec[i].x*x_color+color_spec[i].y, color_spec[i].z, color_spec[i].w));
        //color[i] = vec4(bgcolor,1.0);
            color[i] = vec4(color_scale[i] * x_color.rgb, 1.0);
        }
    }
#endif

void main() {
    vec3 signed_normal = normalize(float(2 * int(gl_FrontFacing) - 1) * x_normal);
    vec3 camera_vector = normalized_difference_(x_position, camera_position);

    vec3 diffuse_light = vec3(0.0);
    vec3 specular_light = vec3(0.0);
    for(int i = 0; i != LIGHT_COUNT; ++i) {
        vec3 light_vector = normalized_difference_(x_position, light_position[i]);
        diffuse_light += diffuse_fn(signed_normal, light_vector) * diffuse_light_color[i].xyz;
        specular_light += specular_fn(signed_normal, light_vector, camera_vector) * specular_light_color[i].xyz;
    }

    float front_facing = float(gl_FrontFacing ^^ bool(x_orientation));
    vec4 d_color2[2];
    compute_color(d_color2);
    vec4 d_color = mix(d_color2[0], d_color2[1], front_facing);
    vec4 s_color = mix(specular_color[0], specular_color[1], front_facing);
    gl_FragColor = vec4(diffuse_light * d_color.xyz + specular_light * s_color.xyz, 1.0);
}