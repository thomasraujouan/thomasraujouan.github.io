import * as THREE from "/js/three.module.js";
import { TrackballControls } from "/js/TrackballControls.js";
import { OBJLoader } from "/js/OBJLoader.module.js";

export class Viewer {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.initScene();
        this.loadSurface().then(() => {
            this.setMaterial();
            this.applyPositioning();
        }).catch(err => console.error(err));
        this.animate();
    }

    initScene() {
        // SCENE
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.params.color || 0x00ff00);
        // LIGHT
        this.scene.add(new THREE.AmbientLight(0xffffff));
        // CAMERA
        this.camera = new THREE.PerspectiveCamera(
            30,
            this.container.clientWidth / this.container.clientHeight,
            0.01,
            1000
        );

        this.camera.position.z = 15;
        this.camera.lookAt(0, 0, 0);

        this.initialCamera = this.camera.clone();
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        this.camera.add(pointLight);
        // this.scene.add(this.camera);

        // RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(this.container.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // CONTROLS
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.rotateSpeed = 2.0;
        this.controls.zoomSpeed = 0.5;
        this.controls.panSpeed = 0.5;
    }
    loadSurface() {
        return new Promise((resolve, reject) => {

            const loader = new OBJLoader();
            loader.load(
                "./e3-1v.obj",
                object => {


                    this.loadedObject = object;
                    this.scene.add(object);
                    resolve(object);
                },
                xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
                error => {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        });
    }

    setMaterial() {
        if (this.loadedObject) {
            // TEXTURE
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load("./texture.svg", () => this.render());
            texture.anisotropy = 4
            this.loadedObject.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xbbbbbb,
                        shininess: 15,
                        map: texture,
                        side: THREE.DoubleSide // (or THREE.FrontSide) no face culling
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        } else {
            console.warn('The object has not been loaded yet.');
        }
    }

    applyPositioning() {
        if (this.loadedObject) {
            const pieces = [];

            // Base object transformations
            this.loadedObject.rotateY((1 * Math.PI) / 8);
            this.loadedObject.rotateX((-0 * Math.PI) / 16);
            this.loadedObject.rotateZ((0 * Math.PI) / 2);

            const copy1 = this.loadedObject.clone();
            const copy2 = this.loadedObject.clone();
            const copy3 = this.loadedObject.clone();

            // Apply custom transformations
            copy1.scale.y = -1;
            copy3.scale.y = -1;
            copy2.rotateX(Math.PI);
            copy3.rotateX(Math.PI);

            // Collect pieces
            pieces.push(this.loadedObject, copy1, copy2, copy3);

            // Add each piece to the scene
            for (let index = 0; index < pieces.length; index++) {
                this.scene.add(pieces[index]);
            }
        } else {
            console.warn('The object has not been loaded yet.');
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.render();
        this.controls.update();
    }
}

