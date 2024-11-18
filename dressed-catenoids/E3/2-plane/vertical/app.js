import { Viewer } from "/dressed-catenoids/threejsViewer.js";


// Configuration (specific to each surface)
const config = {
    objSource: "./e3-2v.obj",
    textureSource: "./texture.svg",
    backgroundColor: "white", // White for this page
    globalTransform:
        (obj) => {
            obj.rotateZ(0);
            obj.rotateX(Math.PI / 2);
            obj.rotateY(Math.PI / 2);
        },
    copiesTransforms: [
        (obj) => obj.scale.x = -1,
        (obj) => obj.scale.y = -1,
        (obj) => {
            obj.scale.x = -1;
            obj.scale.y = -1
        },
        (obj) => obj.rotateX(Math.PI),
        (obj) => {
            obj.rotateX(Math.PI);
            obj.scale.x = -1
        },
        (obj) => {
            obj.rotateX(Math.PI);
            obj.scale.y = -1
        },
        (obj) => {
            obj.rotateX(Math.PI)
            obj.scale.x = -1;
            obj.scale.y = -1
        }
    ],
    cameraPosition: { x: 0, y: 0, z: 20 },
    // Add more params as needed
};

// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);
