function flatten(_) { // TODO: should be un utils.js
  'use strict';
  return [].concat.apply([], _);
};

export function obj_to_json(text) {
  'use strict';

  const json = {
    v: [],
    vt: [],
    vn: [],
    f: []
  };

  const obj_lines = get_lines(text);
  obj_lines.forEach(line => {
    const type = line.shift();
    if (type in json && type !== 'f') {
      const coord_floats = [];
      line.forEach(x => coord_floats.push(parseFloat(x)))
      json[type].push(coord_floats)
    } else if (type == 'f') {
      const f1 = line[0].split("/")[0] - 1;
      const f2 = line[1].split("/")[0] - 1;
      const f3 = line[2].split("/")[0] - 1;
      json.f.push([f1, f2, f3])
    }
  });

  function get_lines(text) {
    const result = [];
    const lines = text.split(/\r?\n/);
    lines.forEach(line => {
      const newline = line.split(" ")
      result.push(newline);
    });
    return result;
  }

  return json
}

export function make_spaceform(obj_json, surface) {
  const length = obj_json.v[0].length
  if (length == 3) {
    surface.spaceform = { "sign": 0 };
  }
  else if (length == 4) {
    surface.spaceform = { "sign": 0 } //TODO: add the option  for H3
  }
  return true
}

export function make_vertex(obj_json, surface) {
  surface.vertex = {
    "packing": [
      { "name": "position", "type": "float32", "stride": 4 },
      { "name": "normal", "type": "float32", "stride": 4 },
      { "name": "texture", "type": "float32", "stride": 2 }
    ],
    "data": []
  };
  const signature = surface.spaceform.sign;
  if (signature == 0) {
    for (let k = 0; k < obj_json.v.length; k++) {
      const position = [...obj_json.v[k], 1.0];
      const normal = [...obj_json.vn[k], 0.0];
      const texture = obj_json.vt[k];
      surface.vertex.data.push(...position);
      surface.vertex.data.push(...normal);
      surface.vertex.data.push(...texture);
    }
  } else if (signature == 1) {
    for (let k = 0; k < obj_json.v.length; k++) {
      const position = obj_json.v[k];
      const normal = obj_json.vn[k];
      const texture = obj_json.vt[k];
      surface.vertex.data.push(...position);
      surface.vertex.data.push(...normal);
      surface.vertex.data.push(...texture);
    }
  }
  surface.vertex.data = new Float32Array(surface.vertex.data);
  return true
}

export function make_element(obj_json, surface) {
  surface.element = {
    "mode": "triangles",
    "type": "uint16",
    "data": []
  };
  obj_json.f.forEach(face => {
    surface.element.data.push(...face);
  });
  surface.element.data = new Uint16Array(surface.element.data);
  return true
}

export function make_transform(obj_json, surface) {
  surface.transform = {
    "packing": [
      { "name": "transform", "type": "float32", "stride": 16 },
      { "name": "orientation", "type": "float32", "stride": 2 }
    ],
    "count": 1,
    "block_count": 1,
    "data": [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0,

      1.0, 1.0
    ]
  };
  surface.transform.data = new Float32Array(surface.transform.data);
  return true
}

function get_box(vertices) {

}

export function make_box(obj_json, surface) {
  // TODO: handle S3 via stereographic
  const x_coords = [];
  const y_coords = [];
  const z_coords = [];
  obj_json.v.forEach(v => {
    x_coords.push(v[0]);
    y_coords.push(v[1]);
    z_coords.push(v[2]);
  })
  const xmin = Math.min(...x_coords);
  const xmax = Math.max(...x_coords);
  const ymin = Math.min(...y_coords);
  const ymax = Math.max(...y_coords);
  const zmin = Math.min(...z_coords);
  const zmax = Math.max(...z_coords);
  const x_radius = Math.max(Math.abs(xmin, Math.abs(xmax)));
  const y_radius = Math.max(Math.abs(ymin, Math.abs(ymax)));
  const z_radius = Math.max(Math.abs(zmin, Math.abs(zmax)));
  const r = Math.max(x_radius, y_radius, z_radius);
  const center = [
    (xmin + xmax) / 2,
    (ymin + ymax) / 2,
    (zmin + zmax) / 2,
  ];
  surface.box = {
    "center": center,
    "radius": [r, r, r]
  };
  return true
}

export function make_color(surface) {
  'use strict';
  var color = flatten([
    [0.8, 0.3, 0.3, 1.0], // red
    [0.3, 0.3, 0.8, 1.0], // blue
    [0.3, 0.5, 0.3, 1.0], // green
    [0.76, 0.6, 0.32, 1.0], // orange
    [0.82, 0.72, 0.38, 1.0], // yellow
    [0.2, 0.4, 0.7, 1.0], // blue2
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0],

    [0.8, 0.3, 0.3, 1.0],
    [0.3, 0.3, 0.8, 1.0],
    [0.3, 0.5, 0.3, 1.0],
    [0.2, 0.4, 0.7, 1.0],
    [0.7, 0.2, 1.7, 1.0],
    [0.7, 0.4, 0.2, 1.0],
    [0.3, 0.5, 0.9, 1.0],
    [0.9, 0.7, 0.2, 1.0]
  ]);

  var buffer = new Float32Array(color);
  var divisor = surface.transform.count / surface.transform.block_count;
  var packing = [{ 'name': color, 'type': 'float32', 'stride': 4 }];
  surface.color = { 'packing': packing, 'data': buffer, 'divisor': divisor };
};



// xlab.load_surface = function (url, callback) {
//   'use strict';
//   if (/\.json$/.test(url)) {
//     xlab.load_file(url, function (text) {
//       xlab._on_surface_json(text, callback);
//     });
//   } else if (/\.wgl$/.test(url)) {
//     xlab.load_file(url, function (data) {
//       xlab._on_surface_wgl(data, callback);
//     });
//   } else {
//     throw Error('unsupported surface file extension');
//   }
// };

// xlab._on_surface_json = function (data, callback) {
//     'use strict';

//     var text = String.fromCharCode.apply(null, new Uint8Array(data));
//     var surface = JSON.parse(text);

//     if ('vertex' in surface) {
//         surface.vertex.data = new Float32Array(surface.vertex.data);
//     } 
//     else if ('v' in surface) {
//       surface.vertex.data = new Float32Array(surface["v"].flat(1));
//     }

//     if ('element' in surface) {
//         if ('grid' in surface.element) {
//             surface.element.mode = 'triangle_strip';
//             surface.element.data = xlab.triangulate_grid(surface.element.grid);
//             switch (surface.element.data.BYTES_PER_ELEMENT) {
//             case 1:
//                 surface.element.type = 'uint8';
//                 break;
//             case 2:
//                 surface.element.type = 'uint16';
//                 break;
//             default:
//                 throw Error('unsupported buffer type');
//             }
//         } else {
//             switch (surface.element.type) {
//             case 'uint8':
//                 surface.element.data = new Uint8Array(surface.element.data);
//                 break;
//             case 'uint16':
//                 surface.element.data = new Uint16Array(surface.element.data);
//                 break;
//             default:
//                 throw Error('unsupported numbertype ' + surface.element.type);
//             }
//         }
//     }
//     else if ("f" in surface) {
//       surface.element.type = 'uint16';
//       surface.element.data = new Uint16Array(surface.f.flat(1));
//     }

//     if ('transform' in surface) {
//         surface.transform.data = new Float32Array(surface.transform.data);
//     }

//     xlab._make_color(surface);

//     if (!('box' in surface)) {
//         surface.box = {center: [0, 0, 0], radius: [1, 1, 1]};
//     }

//     callback(surface);
// };

// xlab._on_surface_wgl = function (data, callback) {
//   'use strict';

//   var view = new Int32Array(data);
//   var a, jsonText, json, surface, x;

//   if (view[0] !== parseInt('0x42414c58', 16) ||
//     view[1] !== parseInt('0x4e4f534a', 16)) {
//     throw Error('header is not XLABJSON');
//   }

//   a = new Uint8Array(data.slice(view[2], view[3]));
//   jsonText = String.fromCharCode.apply(null, a);
//   json = JSON.parse(jsonText);

//   surface = json;

//   if ('vertex' in surface) {
//     x = surface.vertex.offset;
//     surface.vertex.data = new Float32Array(data.slice(x[0], x[1]));
//     delete surface.vertex.offset;
//   }

//   if ('element' in surface) {
//     if ('grid' in surface.element) {
//       surface.element.mode = 'triangle_strip';
//       surface.element.data = xlab.triangulate_grid(surface.element.grid);
//       switch (surface.element.data.BYTES_PER_ELEMENT) {
//         case 1: surface.element.type = 'uint8'; break;
//         case 2: surface.element.type = 'uint16'; break;
//         default: throw Error('unsupported buffer type');
//       }
//     } else {
//       x = surface.element.offset;
//       switch (surface.element.type) {
//         case 'uint8':
//           surface.element.data = new Uint8Array(data.slice(x[0], x[1]));
//           break;
//         case 'uint16':
//           surface.element.data = new Uint16Array(data.slice(x[0], x[1]));
//           break;
//         default:
//           throw Error('unsupported numbertype ' + surface.element.type);
//       }
//       delete surface.element.offset;
//     }
//   }

//   if ('transform' in surface) {
//     x = surface.transform.offset;
//     surface.transform.data = new Float32Array(data.slice(x[0], x[1]));
//     delete surface.transform.offset;
//   }

//   xlab._make_color(surface);

//   if (!('box' in surface)) {
//     surface.box = { center: [0, 0, 0], radius: [1, 1, 1] };
//   }

//   callback(surface);
// };

export function load_file(url, callback) {
  'use strict';
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.responseType = 'arraybuffer';

  /*jshint unused:false*/
  req.onload = function (e) {
    if (req.readyState === 4 && req.status === 200) {
      callback(req.response);
    }
  };
  /*jshint unused:true*/

  req.send(null);
};

