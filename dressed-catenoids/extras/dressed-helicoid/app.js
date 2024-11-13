import { Viewer } from "/dressed-catenoids/threejsViewer.js";


// Configuration (specific to each surface)
const config = {
    objSource: "./dressed-helicoid.obj",
    textureSource: "./texture.svg",
    backgroundColor: "white", // White for this page
    numberOfCopies: 3,
    globalTransform:
        (obj) => {
            obj.rotateZ(-Math.PI / 2);
            obj.rotateX(Math.PI / 4);
        },
    copiesTransforms: [],
    cameraPosition: { x: 0, y: 0, z: 10 },
    // Add more params as needed
};

// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);
