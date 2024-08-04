"use strict";

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

/**
 * Cross product of two vectors
 * https://en.wikipedia.org/wiki/Cross_product
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

function norm2(v) {
    let result = 0;
    for (let i = 0; i < v.length; i++) {
        const vi = v[i];
        result += vi * vi;
    }
    return result;
}

function normalize(v) {
    const norm = Math.sqrt(norm2(v));
    const result = [];
    for (let i = 0; i < v.length; i++) {
        const vi = v[i];
        result.push(vi/norm);
    }
    return result;
}

function test() {
    let v = [1,1,1];
    console.log(norm2(v));
    console.log(normalize(v));
}

export { radToDeg, degToRad, test };