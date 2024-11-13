import { Viewer } from "/dressed-catenoids/threejsViewer.js";


// Configuration (specific to each surface)
const config = {
    objSource: "./e3-2v.obj",
    textureSource: "./texture.svg",
    backgroundColor: "white", // White for this page
    numberOfCopies: 3,
    globalTransform:
        (obj) => {
            obj.rotateZ(0);
            obj.rotateX(Math.PI / 2);
            obj.rotateY(Math.PI / 2);
        },
    copiesTransforms: [
        (obj) => obj.rotateX(Math.PI),
        (obj) => obj.rotateY(Math.PI),
        (obj) => {
            obj.rotateX(Math.PI);
            obj.rotateY(Math.PI);
        }
    ],
    cameraPosition: { x: 0, y: 0, z: 5 },
    // Add more params as needed
};

// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);
