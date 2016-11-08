// build/three.js from node_module/three
import * as THREE from 'three';
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls.js');
export default THREE;
