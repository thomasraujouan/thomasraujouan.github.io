import { Viewer } from "/dressed-catenoids/threejsViewer.js";


// Configuration (specific to each surface)
const config = {
    backgroundColor: "white", // White for this page
    numberOfCopies: 3,
    globalTransform:
        (obj) => {
            obj.rotateY((1 * Math.PI) / 8);
            obj.rotateX((-0 * Math.PI) / 16);
            obj.rotateZ((0 * Math.PI) / 2);
        },
    copiesTransforms: [
        (obj) => obj.scale.y = -1,
        (obj) => obj.rotateX(Math.PI),
        (obj) => {
            obj.scale.y = -1;
            obj.rotateX(Math.PI);
        }
    ],
    // Add more params as needed
};

// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);
