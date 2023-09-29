# Jekyll

[x] Remove the welcome on the front page
[x] La date du dernier post n'est pas bonne

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
[ ] Reverse the texture when reflecting the fundamental piece
[?] Finir la mise en modules
[x] Charger THREE en local
[ ] Refaire la surface de Costa
[ ] Encode the symmetries in a json file to automate them
[ ] Sphere intersection
[?] Afficher le catenoid et le dressed catenoid ensemble.
[ ] Hyperbolic vertex shader
[ ] Write a hyperbolicPanCamera function in the style of TrackballControls.panCamera
[ ] Add a hyperbolic_motion vertex shader in the pipeline in the style of displacement_map. You can train by modifying begin_vertex first.
[ ] If Hyperbolic, replace TrackballControls.panCamera by hyperbolicPanCamera and ask THREE to execute the hyperbolic_motion vertex shader in the pipeline

    - Plan: set TrackballControl.noPan to true, read the
    - ShaderChunk in THREE module contains all the shaders
    - ShaderLib contains uniforms and vertex/fragment shaders to use depending on the style (lambert, phong, toon, etc...)
    - The PHONG material vertex shader is vertex$6
    - Should we write a prevertexshader if ambiant space is hyperbolic?
    - There is an unproject() method in THREE.Vector3
    - begin_vertex doesn't do anything, it just copies vec3(position) into vec3(transformed). I should apply my hyperbolic motion here.
    - Trackballcontrol.nopan = true
    - read the mousepan, compute the hyperbolic transformation, apply it in begin_vertex

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
