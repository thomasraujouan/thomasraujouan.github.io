mat3 lorentzMatrix; // z is the time-component
lorentzMatrix[0] = vec3(cosh(lorentz), 0.0, sinh(lorentz));
lorentzMatrix[1] = vec3(0.0, 1.0, 0.0);
lorentzMatrix[2] = vec3(sinh(lorentz), 0.0, cosh(lorentz));
vec3 newPosition = position*lorentzMatrix;
vec3 transformed = vec3( newPosition );