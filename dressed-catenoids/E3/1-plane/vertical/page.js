import { Viewer } from "/dressed-catenoids/E3/1-plane/vertical/viewer.js";


// Configuration specific to each page
const config = {
    color: "white", // Green for one page
    surfaceType: 'sphere' // Add more params as needed
};



// Get the container DOM element
const container = document.body;

// Initialize the viewer with the container and configuration
const viewer = new Viewer(container, config);


