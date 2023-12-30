float theta = sin(time + position.y) / 1.0;
float c = cos(theta);
float s = sin(theta);
mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
vec3 transformed = vec3(position) * m;
vNormal = vNormal * m;