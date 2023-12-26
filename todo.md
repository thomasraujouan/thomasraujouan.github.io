# Jekyll

[x] Remove the welcome on the front page
[x] La date du dernier post n'est pas bonne
[ ] Link to below in the page

# Academic webpage

[x] faire une page speciale
[x] mail a Morimoto

# xlab

Migrer l'ancien site:
[x] Share directories
[x] Save and read your own files
[?] Screenshots

[x] Remplacer xlab par XLab
[x] Faire un lien vers tous les posts dans la page xlab
[ ] Utiliser des titres plutôt que des listes ordonnées.
[ ] About xlab =!= about xlab
[ ] Indiquer qu'il vaut mieux utiliser Xorg que Wayland

# dressed catenoids

[ ] 2dhalf2 is broken
[x] Put the obj of three planes dressed catenoids
[ ] rotate them to have a standing catenoid as initial view

# WebgGL

[x] OrbitControls -> TrackballControls
[ ] Texte de chargement pour chrome
[x] Texte de chargement pour toutes les surfaces
[ ] Texte de chargement de la bonnne couleur
[x] Mieux gérer l'éclairage
[x] space-key: réinitialise la position
[x] C-key: cut the surface (afficher 1/4, 1/2, or 1/1 sur la page)
[ ] Switch between surfaces with arrow keys
[ ] Glisser-deposer obj files
[x] Smooth .obj's with threejs? Need normals in the obj file. I made a python script in /home/thomas/Python/objParser/vertexNormalsAdder.py
[x] Put textures
[x] Symmetries
[ ] Refaire la surface de Costa
[ ] Reverse the texture when reflecting the fundamental piece
[?] Finir la mise en modules
[x] Charger THREE en local
[ ] Encode the symmetries in a json file to automate them
[ ] Sphere intersection
[?] Afficher le catenoid et le dressed catenoid ensemble.
[ ] Use EventDispacher to define a class Keyboard acting in the style of TrackballControls
[ ] 2v.js can still be cut in half
[ ] compute z-near and z-far of camera in terms of bounding bow of object, not with magic numbers
[ ] dressed catenoid with one plane has a hole in it. Refining sampling in Mathematica does not seem to work. One could compute both the whole surface and the pieces and switch between the two when playing with symmetries.
[ ] Compute the helicoid corresponding to the 1planar catenoid
[ ] add a transparent sphere for H3

[ ] Hyperbolic vertex shader
[ ] Example of onBeforeCompile usage: https://codepen.io/prisoner849/pen/BvxBPW
[ ] Write a hyperbolicPanCamera function in the style of TrackballControls.panCamera
[ ] Add a hyperbolic_motion vertex shader in the pipeline in the style of displacement_map. You can train by modifying begin_vertex first.
[ ] If Hyperbolic, replace TrackballControls.panCamera by hyperbolicPanCamera and ask THREE to execute the hyperbolic_motion vertex shader in the pipeline
[ ] use material.defines and material.onBeforeCompile
[ ] You may need to move the normals too in your vertex shader

    - don't forget to define functions before the main in glsl, this is in <common>
    - ShaderChunk in THREE module contains all the shaders
    - ShaderLib contains uniforms and vertex/fragment shaders to use depending on the style (lambert, phong, toon, etc...)
    - The PHONG material vertex shader is vertex$6
    - Should we write a prevertexshader if ambiant space is hyperbolic?
    - begin_vertex doesn't do anything, it just copies vec3(position) into vec3(transformed). I should use that to insert my pre-vertexshader.
    - Trackballcontrol.nopan = true
    - read the mousepan, compute the hyperbolic transformation, apply it in begin_vertex

[ ] Maybe you should just copy the shaders that you really use and get rid of threejs step by step.
[ ] TrackballControls already has a reset method: use it.

# Python

[?] Symmetries?

# Javascript

[ ] absolute path for modules?
if I choose relative paths, i have a lot of "../../"
if I chose non-relative, vscode writes "js/" instead of "/js/"

# misc.

[x] On ne peut pas mettre l'image docker sur github: fichier trop volumineux. Trouver un endroit: gdrive
[ ] Calculer la surface de costa moi-même
[ ] Find the period of the dressed helicoid and display two of them
[ ] Helicoid conformal coords
[x] Use a local version of OBJLoader

# Katrin's viewer

[ ] Drag and drop obj files
[ ] obj parser written in js

    - there is one in OBJLoader: parse(text)

[ ] standard settings for the viewer

    - bounding box
    - automatic zoom
    - automatic centering
    - Think global settings (color, background, etc...)

# Hyperbolic movements

Goal: be able to move a dressed catenoid in the poincare ball model

[ ] Write a vertex shader:
    [x] Antiprojection function
    [x] Hyperbolic motion using the uniform
    [x] Projection function
    [x] Import the glsl file as a string
    [ ] Fix the "string is null" bug
[x] Put the vertex shader in the pipeline
[ ] Controls: use the right-click to move in hyperbolic space
    it should control the uniform to apply on R4 in the vertex shader
    [ ] Plug it to the arrow keys first
    [ ] Plug it to Trackball controls