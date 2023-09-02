import * as THREE from "three";
import { FBXLoader } from "./node_modules/three/examples/jsm/loaders/FBXLoader";

const loader = new FBXLoader();

const modelURL = "./public/assets/doormat-model.fbx";
loader.load(
  modelURL,
  (object) => {
    scene.add(object);
  },
  (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
      console.log(error)
  }
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
renderer.render(scene, camera);
