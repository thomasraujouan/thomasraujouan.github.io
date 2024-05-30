# Lorentzian space viewer

## Minimal example

*This step is a boilerplate.*

1. **DONE** Import a simple minimal surface with threejs (no texture)

I imported from confs/my-confs/tours/dressed-helicoid. 




## Maximal example

*At the end of this step, I can share the pictures.*

1. **DONE** Replace the surface data by a maxface
    - Compute the surface in Mathematica
    - Export as obj
    - Run through the python script that computes smooth normals
    - import the .obj here
2. **DONE** Draw the null cone
3. **DONE** Put a conformal texture

## Lorentz boosts

*This is for moving the surface in Minkowski space with the mouse.*

1. **DONE** Make a minimal example with threejs.
2. Implement a custom vertex shader in threejs and try adding a 1-dimensional lorentz boost.
    - **DONE** Plug a euclidean translation on arrow keys
    - **DONE** Insert a custom vertex shader
    - **DONE** Plug all arrow keys on a Lorentz boost uniform
3. Plug Lorentz boosts to the mouse right-click
    - Need rewriting TrackBallControls?

To modify a pre-existing vertex shader: 
https://stackoverflow.com/questions/59548828/how-to-give-vertex-shader-to-a-geometry-without-changing-the-material-in-threejs

## Tesselation shader

*It's possible that one needs to refine as a Lorentz boost is applied.*

## Perfectionist?

1. The domain is not square, so the texture looks like rectangles. Fix this.
2. **DONE** Choose better colors, lighting.  
3. Fundamental piece on/off
4. Clean the code?
5. I cannot open in a new tab
