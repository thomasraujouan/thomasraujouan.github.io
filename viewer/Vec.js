"use strict";
/**
 * Vec is actually an Array 
 * Static methods return a new Vec
 * Instance method modify the instance
 */
class Vec extends Array {
    constructor(...coords) {
        super(...coords);
    }
    static clone(v) {//TODO: isn't there an Object method for that?
        return new Vec(...v);
    }
    static add(v, w) {
        const result = [];
        for (let i = 0; i < v.length; i++) {
            const vi = v[i];
            const wi = w[i];
            result.push(vi + wi);
        }
        return new Vec(...result);
    }
    static dot(v, w) {
        let result = 0;
        for (let i = 0; i < v.length; i++) {
            const vi = v[i];
            const wi = w[i];
            result += vi * wi;
        }
        return result;
    }
    static sub(v, w) {
        const result = [];
        for (let i = 0; i < v.length; i++) {
            const vi = v[i];
            const wi = w[i];
            result.push(vi - wi);
        }
        return new Vec(...result);
    }
    static negate(v) {
        const result = [];
        for (let i = 0; i < v.length; i++) {
            result.push(-v[i]);
        }
        return new Vec(...result);
    }
    static normalize(v) {
        const result = [];
        const norm = v.norm;
        for (let i = 0; i < v.length; i++) {
            result.push(v[i] / norm);
        }
        return new Vec(...result);
    }
    static cross(v, w) {
        // TODO: handle the error case where v or w is not 3-diemnsionnal
        return new Vec(
            v[1] * w[2] - v[2] * w[1],
            v[2] * w[0] - v[0] * w[2],
            v[0] * w[1] - v[1] * w[0]
        );
    }
    static normal(v1, v2, v3) {
        const e1 = Vec.sub(v2, v1);
        const e2 = Vec.sub(v3, v1);
        const n = Vec.cross(e1, e2);
        n.normalize();
        return n;
    }
    static mean(v1, v2, v3) {
        const sum = new Vec(0,0,0);
        sum.add(v1);
        sum.add(v2);
        sum.add(v3);
        const result = [];
        for (let i = 0; i < 3; i++) {
            result.push(sum[i]/3);
        }
        return new Vec(...result);
    }   
    /**
     * 
     * @param {Vec} v (v1, ..., vn)
     * @returns {Vec} (w1, ..., wn, w0)
     */
    static antiStereoProj(v) {
        const n2 = v.norm2;
        const result = [];
        for (let i = 0; i < v.length; i++) {
            result.push(2 * v[i] / (1 + n2));
        }
        result.push((n2 - 1) / (n2 + 1));
        return new Vec(...result);
    }
    get norm2() {
        return this.dot(this);
    }
    get norm() {
        return Math.sqrt(this.norm2);
    }
    copy(other) {
        for (let i = 0; i < other.length; i++) {
            this[i] = other[i];
        }
    }
    add(other) {
        for (let i = 0; i < other.length; i++) {
            this[i] += other[i];
        }
    }
    negate() {
        for (let i = 0; i < this.length; i++) {
            this[i] = -this[i];
        }
    }
    sub(other) {
        this.add(other.negate());
    }
    normalize() {
        const norm = this.norm;
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i] / norm;
        }
    }
    dot(other) {
        let result = 0;
        for (let i = 0; i < this.length; i++) {
            const vi = this[i];
            const wi = other[i];
            result += vi * wi;
        }
        return result;
    }
}

export { Vec }