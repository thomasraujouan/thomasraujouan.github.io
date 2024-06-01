const hyperbolicVertex = {
  text: null,
};

const fetchShaderCode = fetch("/js/shaders/hyperbolic_vertex.glsl").then(
  (response) => {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`Failed to fetch file. Status: ${response.status}`);
    }
    // Read the response as text and return the promise
    return response.text();
  }
);

// Wait for the shader code to be fetched before setting vertexShader
fetchShaderCode.then((vertexShaderText) => {
  // Now vertexShaderText contains the actual text content
  hyperbolicVertex.text = vertexShaderText;
});

export { hyperbolicVertex };
