#ifdef USE_DISPLACEMENTMAP
transformed = vec3(antiStereographicProjection(transformed).xyz);
transformed += normalize(objectNormal) * (texture2D(displacementMap, vUv).x * displacementScale + displacementBias);
#endif