import * as THREE from 'three';

export function startGame(container) {

  let scene,
    camera,
    renderer;

  let width = window.innerWidth,
    height = window.innerHeight,
    halfWidth = width / 2,
    halfHeight = height / 2;

  init();
  //init components
  loop();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
  }

  function loop() {
    //Update components' position
    render();
    requestAnimationFrame(loop);
  }

  function render() {
    renderer.render(scene, camera);
  }
}
