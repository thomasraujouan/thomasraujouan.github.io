/**
 * Making a wgl parser
 */

import { xlab } from "xlab";

async function loadFile(url) {
    // Load as an ArrayBuffer
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
    }
    return await response.arrayBuffer();
}

function wgl_to_json(wgl) {
    // returns the json that xlab_on_surface computes from the .wgl file
    // json
    var view = new Int32Array(wgl);
    //--------------------------
    // FIX: slice before reading the offsets to avoid possible copy
    //--------------------------
    // check header
    if (view[0] !== parseInt('0x42414c58', 16) ||
        view[1] !== parseInt('0x4e4f534a', 16)) {
        throw Error('header is not XLABJSON');
    }
    var a = new Uint8Array(wgl.slice(view[2], view[3]));
    var json = String.fromCharCode.apply(null, a);
    json = JSON.parse(json);

    var x; // temp
    var bdata; // temp 

    // vertex
    if ('vertex' in json) {
        x = json.vertex.offset;
        bdata = new Float32Array(wgl.slice(x[0], x[1]));
        json.vertex.data = bdata;
    }

    // index
    if ('element' in json) {
        if ('grid' in json.element) {
            // grid
            json.element.mode = 'triangle_strip';
            bdata = xlab.triangulate_grid(json.element.grid);
            switch (bdata.BYTES_PER_ELEMENT) {
                case 1: json.element.type = 'uint8'; break;
                case 2: json.element.type = 'uint16'; break;
                default: throw Error('unsupported buffer type');
            }
        } else {
            // not grid
            var numbertype = json.element['type'];
            x = json.element.offset;
            switch (numbertype) {
                case 'uint8':
                    bdata = new Uint8Array(wgl.slice(x[0], x[1]));
                    break;
                case 'uint16':
                    bdata = new Uint16Array(wgl.slice(x[0], x[1]));
                    break;
                default:
                    throw Error('unsupported numbertype ' + numbertype);
            }
        }
        json.element.data = bdata;
    }

    // transform
    if ('transform' in json) {
        x = json.transform.offset;
        bdata = new Float32Array(wgl.slice(x[0], x[1]));
        json.transform.data = bdata;
    }

    xlab._make_color(json);

    // default box
    if (!('box' in json)) {
        json.box = { center: [0, 0, 0], radius: [1, 1, 1] };
    }
    console.log(json);
    return json
}

export { loadFile, wgl_to_json }