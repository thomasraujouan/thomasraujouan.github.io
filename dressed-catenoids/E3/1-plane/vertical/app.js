import { Viewer } from "/dressed-catenoids/threejsViewer.js";


// Configuration (specific to each surface)
const config = {
    objSource: "./e3-1v.obj",
    textureSource: "./texture.svg",
    textureAnisotropy: 4, // usually a power of 2
    backgroundColor: "white", // White for this page
    surfaceColor: 0xcc0000,
    // numberOfCopies: 3,
    globalTransform:
        (obj) => {
            obj.rotateY((3 * Math.PI) / 8);
            obj.rotateX((0 * Math.PI) / 16);
            obj.rotateZ((-8 * Math.PI) / 16);
        },
    copiesTransforms: [
        (obj) => obj.scale.z = -1,
        (obj) => obj.rotateY(Math.PI),
        (obj) => {
            obj.scale.z = -1;
            obj.rotateY(Math.PI);
        }
    ],
    cameraPosition: { x: 30, y: 0, z: 0 },
    cameraTransform:
        (camera) => {
            // camera.rotateY((1 * Math.PI) / 8);
            // camera.rotateX((1 * Math.PI) / 16);
            // camera.rotateZ((-1 * Math.PI) / 2);
        },
    // Add more params as needed
};

// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);
