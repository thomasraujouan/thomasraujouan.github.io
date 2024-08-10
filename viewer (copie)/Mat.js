"use strict";
/**
 * Mat is actually an array
 * It encodes square matrices
 */
class Mat extends Array {
    constructor(...coefs) {
        super(...coefs);
        this.dimension = Math.sqrt(this.length);
    }
    /**
     * 
     * @param {*} fov field of view in radians
     * @param {*} aspect 
     * @param {*} near 
     * @param {*} far 
     * @returns {Mat} a 4-by-4 perspective matrix
     */
    static perspective(fov, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        var rangeInv = 1.0 / (near - far);
        return new Mat(
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0,
        );
    }
    /**
     * @param {*} width 
     * @param {*} height 
     * @param {*} depth 
     * @returns {Mat} a 4-by-4 projection matrix
     */
    static projection(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return new Mat(
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        );
    }
    /**
     * 
     * @param {*} size 
     * @returns {Mat} the identity matrix.
     */
    static identity(size) {
        const result = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i == j) {
                    result.push(1);
                } else {
                    result.push(0);
                }
            }
        }
        return new Mat(...result);
    }
    static transpose(m) {
        const result = [];
        const n = m.dimension;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                result.push(m[n * j + i]);
            }
        }
        return new Mat(...result);
    }
    /**
     * 
     * @param {*} a1 
     * @param {*} a2 
     * @param {*} b1 
     * @param {*} b2 
     * @returns {Mat} a 3-by-3 rotation matrix
     */
    static rotationFromQuaternion(a1, a2, b1, b2) {
        const r11 = a1 * a1 - a2 * a2 - b1 * b1 + b2 * b2;
        const r12 = -2 * (a1 * a2 + b1 * b2);
        const r13 = 2 * (a1 * b1 - a2 * b2);
        const r21 = 2 * (a1 * a2 - b1 * b2);
        const r22 = a1 * a1 - a2 * a2 + b1 * b1 - b2 * b2;
        const r23 = 2 * (a2 * b1 + a1 * b2);
        const r31 = -2 * (a1 * b1 + a2 * b2);
        const r32 = 2 * (a2 * b1 - a1 * b2);
        const r33 = a1 * a1 + a2 * a2 - b1 * b1 - b2 * b2;
        return new Mat(
            r11, r12, r13,
            r21, r22, r23,
            r31, r32, r33
        );
    }
    static rotationFromMouse(dx, dy, speed) {
        const u = speed * dx;
        const v = speed * dy;
        const r = Math.sqrt(u * u + v * v);
        const c = Math.cos(r);
        const s = Math.sin(r);
        if (r < 0.00001) { //TODO: fix this
            return Mat.identity(3);
        } else {
            return Mat.rotationFromQuaternion(c, 0, s * u / r, s * v / r);
        }
    }
    static multiply(a, b) {
        const A = [];
        const B = [];
        const result = [];
        const n = a.dimension;
        for (let i = 0; i < n; i++) {
            A[i] = [];
            B[i] = [];
            for (let j = 0; j < n; j++) {
                A[i].push(a[i * n + j]);
                B[i].push(b[i * n + j]);
            }
        }
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                var coef = 0;
                for (let k = 0; k < n; k++) {
                    coef +=  B[i][k] * A[k][j]; // GPU matrix multiplication
                }
                result.push(coef);
            }
        }
        return new Mat(...result);
    }
    /**
     * insert a 0...010...0 at nth line and column
     * n=0 makes the first line 10...0
     * @param {*} n 
     */
    resize(n) {
        const result = [];
        for (let i = 0; i < this.dimension + 1; i++) {
            for (let j = 0; j < this.dimension + 1; j++) {
                if (i == n || j == n) {
                    if (i == j) {
                        result.push(1);
                    } else {
                        result.push(0);
                    }
                } else {
                    result.push(this.shift());
                }
            }
        }
        for (let i = 0; i < result.length; i++) {
            this[i] = result[i];
        }
        this.dimension += 1;
    }
}
