import THREE from './three';
import { TweenMax } from 'gsap';

export function startGame(container) {

  let scene,
    camera,
    renderer,
    clock;

  let width = window.innerWidth,
    height = window.innerHeight;

  //Will keep track of time using clock and delta
  let delta = 0;
  let speed = 5;
  const MAXSPEED = 60;
  const MINSPEED = 5;
  let distance = 0;
  let gameState = 'stopped';
  let sky,
    llama,
    apple,
    planet;

  let music = new Audio('Marvin_s_Dance.mp3');
  music.volume = 0.5;

  let chompApple = new Audio('bite.wav');

  let feedButton = document.getElementById('feed');
  let startGame = document.getElementById('start-game');
  let stopGame = document.getElementById('stop-game');
  let cheerUp = document.getElementById('cheer-up');

  window.addEventListener('resize', resize, false);

  feedButton.addEventListener('click', function(e) {
    e.stopPropagation();
    apple.show();
  }, false);

  startGame.addEventListener('click', function(e) {
    e.stopPropagation();
    stopGame.classList.remove('no-visible');
    feedButton.classList.remove('no-visible');
    cheerUp.classList.remove('no-visible');
    startGame.classList.add('no-visible');
    gameState = 'playing';
    music.play();
  });

  stopGame.addEventListener('click', function(e) {
    e.stopPropagation();
    stopGame.classList.add('no-visible');
    feedButton.classList.add('no-visible');
    cheerUp.classList.add('no-visible');
    startGame.classList.remove('no-visible');
    gameState = 'stopped';
    music.pause();
  });

  function resize() {
    height = window.innerHeight;
    width = window.innerWidth;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  let llamaCalories = document.getElementById('calories');

  let whiteMatte = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  let blackMatte = new THREE.MeshPhongMaterial({
    color: 0x212121,
    shading: THREE.FlatShading
  });

  let cloudColor = new THREE.MeshPhongMaterial({
    color: 0x18FFFF,
    shading: THREE.FlatShading
  });

  let lightFur = new THREE.MeshPhongMaterial({
    color: 0xFAFAFA,
    shading: THREE.FlatShading
  });

  let darkFur = new THREE.MeshPhongMaterial({
    color: 0xFF6D2B,
    shading: THREE.FlatShading
  });

  let fruitColor = new THREE.MeshPhongMaterial({
    color: 0xC8102E,
    shininess: 50
  });

  let leafColor = new THREE.MeshPhongMaterial({
    color: 0x3BD23D,
    shininess: 50
  });

  let planetColor = new THREE.MeshPhongMaterial({
    color: 0xEA27C2,
    shading: THREE.FlatShading
  });

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
    camera.position.z = 160;
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    container.addEventListener('click', triggerJump, false);
    document.addEventListener('keydown', function(event) {
      if (event.keyCode === 32) {
        triggerJump();
      } else if (event.keyCode === 190) {
        speed = Math.min(speed + 5, MAXSPEED);
      } else if (event.keyCode === 188) {
        speed = Math.max(speed - 5, MINSPEED);
      }
    }, false);
  }

  function lights() {
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    var directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.castShadow = true;
    directional.position.set(-45, 40, 20);
    scene.add(directional);
  }

  function Sky() {
    this.mesh = new THREE.Group();
    this.cycle = 0;
    var cloudGeometry = new THREE.CubeGeometry(6, 6, 6, 1);

    for (var i = 1; i <= 20; i++) {
      var cloud = new THREE.Mesh(cloudGeometry, cloudColor);
      cloud.position.x = Math.floor(Math.random() * 400) - 200;
      cloud.position.y = Math.floor(Math.random() * 65) + 50;
      cloud.position.z = Math.floor(Math.random() * - 25) - 75;
      this.mesh.add(cloud);
    }
  }

  function createSky() {
    sky = new Sky();
    scene.add(sky.mesh);
  }

  Sky.prototype.move = function() {
    this.cycle += delta;
    // The cycle counts between 0 and 2*PI. % makes sure it never goes over that number. Goes back to 0.
    this.cycle = this.cycle % (Math.PI * 2);

    this.mesh.position.x = Math.sin(this.cycle) * 8;
  }

  function Llama() {
    this.mesh = new THREE.Group();
    this.body = new THREE.Group();

    this.runningCycle = 0;
    this.calories = 2000;
    this.state = 'running';

    var bellyGeometry = new THREE.CubeGeometry(15, 10, 8, 1);
    this.belly = new THREE.Mesh(bellyGeometry, lightFur);
    this.belly.castShadow = true;
    this.body.add(this.belly);

    var neckGeometry = new THREE.CubeGeometry(5, 17, 8, 1);
    this.neck = new THREE.Mesh(neckGeometry, lightFur);
    this.neck.position.y = 10;
    this.neck.position.x = 5;
    this.neck.castShadow = true;
    this.body.add(this.neck);

    var headGeometry = new THREE.CubeGeometry(10, 5, 8, 1);
    headGeometry.vertices[2].y += 2;
    headGeometry.vertices[3].y += 2;
    this.head = new THREE.Mesh(headGeometry, lightFur);
    this.head.position.x = 7.5;
    this.head.position.y = 19;
    this.head.castShadow = true;
    this.body.add(this.head);

    var legGeometry = new THREE.ConeGeometry(0.8, 10, 32);
    // Changing origin point for rotation
    legGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 6, 0));
    this.legFrontLeft = new THREE.Mesh(legGeometry, lightFur);
    this.legFrontLeft.castShadow = true;
    this.legFrontLeft.position.x = 6;
    this.legFrontLeft.position.y = -4;
    this.legFrontLeft.rotation.z = 3.2;
    this.legFrontLeft.position.z = -3;
    this.legFrontLeft.castShadow = true;
    this.mesh.add(this.legFrontLeft);

    this.legFrontRight = this.legFrontLeft.clone();
    this.legFrontRight.position.z = -this.legFrontLeft.position.z;
    this.legFrontRight.castShadow = true;
    this.mesh.add(this.legFrontRight);

    this.legBackLeft = this.legFrontLeft.clone();
    this.legBackLeft.position.x = -this.legFrontLeft.position.x;
    this.legBackLeft.castShadow = true;
    this.mesh.add(this.legBackLeft);

    this.legBackRight = this.legFrontRight.clone();
    this.legBackRight.position.x = -this.legFrontRight.position.x;
    this.legBackRight.castShadow = true;
    this.mesh.add(this.legBackRight);

    var tailGeometry = new THREE.CubeGeometry(4, 2, 2, 1);
    tailGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,0.2));
    tailGeometry.vertices[4].y -= 1;
    tailGeometry.vertices[5].y -= 1;
    this.tail = new THREE.Mesh(tailGeometry, darkFur);
    this.tail.position.x = -8;
    this.tail.position.y = 2;
    this.tail.castShadow = true;
    this.body.add(this.tail);

    var earGeometry = new THREE.CubeGeometry(2, 4, 2, 1);
    this.earLeft = new THREE.Mesh(earGeometry, lightFur);
    this.earLeft.position.x = 3.5;
    this.earLeft.position.y = 23;
    this.earLeft.position.z = -3;
    this.earLeft.castShadow = true;
    this.body.add(this.earLeft);

    this.earRight = this.earLeft.clone();
    this.earRight.position.z = -this.earLeft.position.z;
    this.body.add(this.earRight);

    var eyeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    this.eyeRight = new THREE.Mesh(eyeGeometry, whiteMatte);
    this.eyeRight.castShadow = true;
    this.eyeRight.position.x = 7.5;
    this.eyeRight.position.y = 22;
    this.eyeRight.position.z = 4;
    this.body.add(this.eyeRight);

    this.eyeLeft = this.eyeRight.clone();
    this.eyeLeft.position.z = -this.eyeRight.position.z;
    this.body.add(this.eyeLeft);

    var pupilGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.pupilRight = new THREE.Mesh(pupilGeometry, blackMatte);
    this.pupilRight.castShadow = true;
    this.pupilRight.position.x = 7.5;
    this.pupilRight.position.y = 22;
    this.pupilRight.position.z = 5.5;
    this.body.add(this.pupilRight);

    this.pupilLeft = this.pupilRight.clone();
    this.pupilLeft.position.z = -this.pupilRight.position.z;
    this.body.add(this.pupilLeft);

    this.mesh.add(this.body);
  }

  Llama.prototype.run = function() {
    this.calories -= 0.2;

    this.runningCycle += delta * speed;
    this.runningCycle = this.runningCycle % (Math.PI*2);
    var t = this.runningCycle;
    // t = some number between 0 and 6.28 (PI * 2)

    this.legFrontRight.rotation.z = (Math.sin(t + .4) * Math.PI/12) - 3.2;
    this.legFrontRight.position.y = - 2 - Math.sin(t);

    this.legFrontLeft.rotation.z = (Math.sin(t) * Math.PI/12) - 3.2;
    this.legFrontLeft.position.y = - 2 - Math.sin(t);

    this.legBackRight.rotation.z = (Math.sin(t + 1.4) * Math.PI/12) - 3.2;
    this.legBackRight.position.y = - 2 - Math.sin(t);

    this.legBackLeft.rotation.z = (Math.sin(t + 1) * Math.PI/12) - 3.2;
    this.legBackLeft.position.y = - 2 - Math.sin(t);

    this.tail.rotation.z = (Math.sin(t + .4) * Math.PI/12) - 3.2;
    this.body.position.y = -Math.sin(t);
  }

  Llama.prototype.jump = function() {
    if (this.state === 'jumping') {
      return;
    }
    this.state = 'jumping';
    // Animating Llama's mesh.
    TweenMax.to(this.mesh.position, 1, {y: 30, ease:TweenMax.Power2.easeOut,
      onComplete: function() {
        if (apple.canEat()) {
          apple.eat();
          llama.eat();
        }
      }
    });
    TweenMax.to(this.mesh.position, 1, {y: 0, ease:TweenMax.Power4.easeIn, delay: 1,
      onComplete: function() {
        this.state = 'running';
      }.bind(this)
    });
  }

  Llama.prototype.eat = function() {
    this.calories += 50;
    chompApple.play();
    chompApple.volume = 1;
  }

  function createLlama() {
    llama = new Llama();
    scene.add(llama.mesh);
  }

  function Apple() {
    this.mesh = new THREE.Group();

    var fruitGeometry = new THREE.SphereGeometry(2, 16, 16);
    this.fruit = new THREE.Mesh(fruitGeometry, fruitColor);
    this.fruit.position.x = 12;
    this.fruit.position.y = 50;

    var leafGeometry = new THREE.CubeGeometry(1.5, 2.5, 0.5);
    this.leaf = new THREE.Mesh(leafGeometry, leafColor);
    this.leaf.position.x = 12.1;
    this.leaf.position.y = 52;

    this.mesh.add(this.fruit);
    this.mesh.add(this.leaf);
    this.mesh.visible = false;
  }

  Apple.prototype.canEat = function() {
    return this.mesh.visible;
  }

  Apple.prototype.eat = function() {
    this.mesh.visible = false;
  };

  Apple.prototype.show = function() {
    this.mesh.visible = true;
  }

  function createApple() {
    apple = new Apple();
    scene.add(apple.mesh);
  };

  function createPlanet() {
    var planetGeometry = new THREE.SphereGeometry(70, 120, 120);
    planet = new THREE.Mesh(planetGeometry, planetColor);
    planet.position.y = -80;
    planet.receiveShadow = true;
    scene.add(planet);
  }

  function loop() {
    delta = clock.getDelta();

    if (gameState === 'playing') {
      planet.rotation.z += (speed * .002);
      distance += speed * 2;
      sky.move();
      if(llama.state === 'running') {
        llama.run();
      }
      llamaCalories.innerHTML = parseInt(llama.calories);
    }

    render();
    requestAnimationFrame(loop);
  }

  function triggerJump() {
    llama.jump();
  }

  function render() {
    renderer.render(scene, camera);
  }

  init();
  lights();
  createSky();
  createLlama();
  createApple();
  createPlanet();
  loop();
}


//build clouds
//add music
//style form stuff
