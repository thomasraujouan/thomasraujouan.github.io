"use strict";

import { m4 } from "./m4.js";
import { Vec } from "./Vec.js";

// we want to make a buffer out of an obj file
// obj files may not have redundancy, but buffers are redundant

// HELPERS
function isVertexString(str) {
    return str[0] == 'v';
}
function isFaceString(str) {
    return str[0] == 'f';
}
//TODO: also parse quads
function hasThreeElements(str) {
    return (str.slice(1).trim().split(' ').length == 3);
}
function parseFaceLine(str) {
    const result = [];
    let resultString = str.slice(1).trim().split(' ');
    resultString.forEach(element => {
        result.push(parseInt(element));
    });
    return result;
};
function parseVertexLine(str) {
    const result = [];
    let resultString = str.slice(1).trim().split(' ');
    resultString.forEach(element => {
        result.push(parseFloat(element));
    });
    return new Vec(...result);
};

class Obj {
    constructor(vertices = [], faces = []) {
        this.vertices = vertices;
        this.faces = faces;
        this.normals = null;
        this.matrices = null;
        this.vertexBuffer = null;
        this.normalBuffer = null;
        this.colorBuffer = null;
    }
    /**
     * Parse a string into an Obj
     * @param {String} str An obj file in the form of a string
     * @returns {Obj} an Obj containing vertices and faces data
     */
    static parseToObj(str) {
        const vertices = [];
        const faces = [];
        const lines = str.split('\n');
        lines.forEach(line => {
            if (isVertexString(line)) {
                vertices.push(parseVertexLine(line));
            } else if (isFaceString(line) && hasThreeElements(line)) {
                faces.push(parseFaceLine(line));
            };
        });
        return new Obj(vertices, faces);
    }
    // GETTERS (they are memoized by cache variables)
    /**
     * Assumes that vertices are 3-dimensional
     */
    get boundingBox() {
        const result = {
            "min": [Infinity, Infinity, Infinity],
            "max": [-Infinity, -Infinity, -Infinity]
        };
        this.vertices.forEach(triple => {
            const [a, b, c] = triple;
            if (a < result.min[0]) {
                result.min[0] = a;
            }
            else if (a > result.max[0]) {
                result.max[0] = a;
            }
            if (b < result.min[1]) {
                result.min[1] = b;
            }
            else if (b > result.max[1]) {
                result.max[1] = b;
            }
            if (c < result.min[2]) {
                result.min[2] = c;
            }
            else if (c > result.max[2]) {
                result.max[2] = c;
            }
        });
        return [result.min, result.max];
    }
    get size() {
        const [[a1, a2, a3], [b1, b2, b3]] = this.boundingBox;
        return [b1 - a1, b2 - a2, b3 - a3];
    }
    get center() {
        const [[a1, a2, a3], [b1, b2, b3]] = this.boundingBox;
        return [(a1 + b1 / 2), (a2 + b2 / 2), (a3 + b3 / 2)]
    }
    // COMPUTERS
    computeVertexBuffer() {
        const result = [];
        this.faces.forEach(triple => {
            const [i, j, k] = triple;
            const v1 = this.vertices[i - 1];
            const v2 = this.vertices[j - 1];
            const v3 = this.vertices[k - 1];
            result.push(...v1);
            result.push(...v2);
            result.push(...v3);
        });
        this.vertexBuffer = new Float32Array(result);
    }
    computeColorBuffer() {
        const result = [];
        if (this.color == "random" || !this.color) {
            this.faces.forEach(triple => {
                const a = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                const c = Math.floor(Math.random() * 255);
                result.push(...[a, b, c]);
                result.push(...[a, b, c]);
                result.push(...[a, b, c]);
            });
        }
        else if (this.color == "blue") {
            this.faces.forEach(triple => {
                const blue = [3, 0, 173];
                result.push(...blue);
                result.push(...blue);
                result.push(...blue);
            });
        }
        this.colorBuffer = new Uint8Array(result);
    }
    /**
     * Compute the face normals from this.vertices and feed this.normalBuffer
     * @returns a buffer containing the normals
     */
    computeFaceNormalsBuffer() {
        const result = new Array();
        this.faces.forEach(([i, j, k]) => {
            const v1 = new Vec(...this.vertices[i - 1]);
            const v2 = new Vec(...this.vertices[j - 1]);
            const v3 = new Vec(...this.vertices[k - 1]);
            const normal = Vec.normal(v1, v2, v3);
            result.push(...normal);
            result.push(...normal);
            result.push(...normal);
        });
        this.normalBuffer = new Float32Array(result);//TODO: do this for all computers?
    }
    /**
     * this.faceNormals[i][j] is the jth normal attached to the ith vertex
     */
    computeFaceNormals() {
        // face normals indexed as vertices
        this.faceNormals = [];
        for (let i = 0; i < this.vertices.length; i++) {
            this.faceNormals.push([]);
        }
        this.faces.forEach(([i, j, k]) => {
            const v1 = this.vertices[i - 1];
            const v2 = this.vertices[j - 1];
            const v3 = this.vertices[k - 1];
            const normal = Vec.normal(v1, v2, v3);
            this.faceNormals[i - 1].push(normal);
            this.faceNormals[j - 1].push(normal);
            this.faceNormals[k - 1].push(normal);
        });
    }
    computeVertexNormals() {
        this.vertexNormals = [];
        this.computeFaceNormals();
        // orient the face normals in the same direction:
        this.faceNormals.forEach(normals => {
            const refNormal = normals[0];
            for (let i = 1; i < normals.length; i++) {
                var dot = refNormal.dot(normals[i]);
                if (dot < 0) {
                    normals[i].negate();
                }
            }
        })
        // compute the mean value of all the normals attached to each vertex
        this.faceNormals.forEach(list => {
            const v = Vec.mean(...list);
            v.normalize()
            this.vertexNormals.push(v);
        });
    }
    computeVertexNormalsBuffer() {
        this.computeVertexNormals();
        // feed the buffer
        const result = new Array();
        this.faces.forEach(([i, j, k]) => {
            const n1 = this.vertexNormals[i - 1];
            const n2 = this.vertexNormals[j - 1];
            const n3 = this.vertexNormals[k - 1];
            result.push(...n1);
            result.push(...n2);
            result.push(...n3);
        });
        this.normalBuffer = new Float32Array(result);//TODO: do this for all computers?
    }
    /**
     * Feed this.vertices with their anti-stereographic projections
     */
    toS3() {
        const newVertices = [];
        this.vertices.forEach(vertex => {
            const v = new Vec(...vertex);
            const w = Vec.antiStereoProj(v);
            newVertices.push(w);
        });
        this.vertices = newVertices;
    }
    parseObj(str) {
        const vertices = [];
        const faces = [];
        const lines = str.split('\n');
        lines.forEach(line => {
            if (isVertexString(line)) {
                vertices.push(parseVertexLine(line));
            } else if (isFaceString(line) && hasThreeElements(line)) {
                faces.push(parseFaceLine(line));
            };
        });
        this.vertices = vertices;
        this.faces = faces;
    }
}

export { Obj }