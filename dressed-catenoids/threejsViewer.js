import * as THREE from "/js/three.module.js";
import { TrackballControls } from "/js/TrackballControls.js";
import { OBJLoader } from "/js/OBJLoader.module.js";

export class Viewer {
    constructor(container, params) {
        this.container = container;
        this.params = params;
        this.initScene();
        this.initControls();
        this.loadSurface().then(() => {
            this.setMaterial();
            this.applyTransforms();
            this.animate();
            this.addEvents();
        }).catch(err => console.error(err));
    }

    initScene() {
        // SCENE
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.params.backgroundColor || 0x00ff00);
        // LIGHTS
        this.scene.add(new THREE.AmbientLight(this.params.ambientLightColor || 0xffffff));
        const pointLight = new THREE.PointLight(this.params.pointLightColor || 0xffffff, this.params.pointLightIntensity || 0.25);
        pointLight.position.set(-50, 0, 0);
        this.scene.add(pointLight);
        // CAMERA
        this.camera = new THREE.PerspectiveCamera(
            30,
            this.container.clientWidth / this.container.clientHeight,
            0.01,
            1000
        );
        this.camera.position.setX((this.params.cameraPosition) ? this.params.cameraPosition.x : 0);
        this.camera.position.setY((this.params.cameraPosition) ? this.params.cameraPosition.y : 0);
        this.camera.position.setZ((this.params.cameraPosition) ? this.params.cameraPosition.z : 15);
        this.initialCamera = this.camera.clone();
        // RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(this.container.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
    }

    initControls() {
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
                this.params.objSource,
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
            const texture = textureLoader.load(this.params.textureSource, () => this.render());
            texture.anisotropy = 4;
            this.loadedObject.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
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

    applyTransforms() {
        if (this.loadedObject) {
            const pieces = [];
            // Base object transformations
            this.params.globalTransform(this.loadedObject);
            // Make copies
            const copies = [];
            this.params.copiesTransforms.forEach(() => {
                copies.push(this.loadedObject.clone())
            });
            // Apply copies transformations
            for (let i = 0; i < copies.length; i++) {
                const copy = copies[i];
                const transform = this.params.copiesTransforms[i];
                transform(copy);
            }
            // Collect pieces
            pieces.push(this.loadedObject, ...copies);
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

    addEvents() {
        // callback are executed in order to recover this.something
        addEventListener("keydown", this.reInitializeCamera());
        addEventListener("keydown", this.numberPadSwitch());
        addEventListener("keydown", this.allVisible());
        addEventListener("resize", this.onWindowResize());
    }

    reInitializeCamera(camera, initialCamera) {
        return event => {
            if (event.key === " ") {
                this.camera.copy(this.initialCamera);
                this.resizeWindow();
            };
        }
    };

    numberPadSwitch() {
        return event => {
            var temp = this.getPieces();
            const keys = [];
            for (let index = 0; index < temp.length; index++) {
                keys.push((index + 1).toString());
            }
            if (keys.includes(event.key)) {
                temp[parseInt(event.key) - 1].visible =
                    !temp[parseInt(event.key) - 1].visible;
            }
        }
    }

    allVisible() {
        return (event) => {
            if (event.key === "0") {
                var temp = this.getPieces();
                for (let index = 0; index < temp.length; index++) {
                    temp[index].visible = true;
                };
            }
        }
    }

    onWindowResize() {
        return event => {
            this.resizeWindow();
        }
    }

    resizeWindow() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    getPieces() {
        const result = [];
        this.scene.traverse(function (child) {
            if (child.isMesh) {
                result.push(child);
            }
        });
        return result;
    };
}

