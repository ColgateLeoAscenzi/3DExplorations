// Student name: Leonardo Ascenzi


var propellerOn = true;
var paused = false;
var firstPerson = false;
var altitude = 0;

var turningLeft = false;
var turningRight = false;
var goingUp = false;
var goingDown = false;
var shooting = false;

var turnSpeed = 0.05;
var altSpeed = 5;

var projectiles = [];

var normalCamera = true;
var unlockedCamera = false;
var isometricCamera = false;
var adsLeftCamera = false;
var fireParticles = [];

var playingMusic = false;

//audio
var audioLoader = new THREE.AudioLoader();

var listener = new THREE.AudioListener();


//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container, propellerSpeed;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {



  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;



  var defaultPlanePos = [0,0,0];

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  shadowLight.shadow.radius = 1;

  scene.add(hemisphereLight);
  scene.add(shadowLight);

}

var geomCockpit;


Sky = function() {
  this.mesh = new THREE.Object3D();

  if(firstPerson){
      this.nClouds = 100;

  }
  else{
     this.nClouds = 20;
  }
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle * i;
    var h = 1025 + Math.random() * 200;

    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;
    if(firstPerson){
        c.mesh.position.z = -400 + Math.random() * 800;

    }
    else{
        c.mesh.position.z = -400 - Math.random() * 400;
    }
    c.mesh.rotation.z = a + Math.PI/2;

    var s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);
    this.mesh.add(c.mesh);
  }
}


Sea = function() {
  var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI/2 ));

  var mat = new THREE.MeshPhongMaterial({
    color : Colors.blue,
    transparent : true,
    opacity : .6,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}


Cloud = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20,20,20);

  var mat = new THREE.MeshPhongMaterial({
    color : Colors.white,
  });

  var nBlocs = 3 + Math.floor( Math.random() * 3 );

  for (var i = 0; i < nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    var s = .1 + Math.random() * .9;
    m.scale.set(s, s, s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

Enemy = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "enemy";
  var geom = new THREE.CubeGeometry(20,20,20);

  var mat = new THREE.MeshPhongMaterial({
    color : Colors.red,
  });

  var c = new THREE.Mesh(geom.clone(), mat);
  this.mesh.add(c);

  var e = new THREE.Mesh(geom.clone(), mat);
  e.scale.set(0.5, 0.5, 0.5);
  e.position.z += 15;
  this.mesh.add(e);

  var w = new THREE.Mesh(geom.clone(), mat);
  w.scale.set(0.5, 0.5, 0.5);
  w.position.z -= 15;
  this.mesh.add(w);

  var f = new THREE.Mesh(geom.clone(), mat);
  f.scale.set(0.5, 0.5, 0.5);
  f.position.x += 15;
  this.mesh.add(f);

  var b = new THREE.Mesh(geom.clone(), mat);
  b.scale.set(0.5, 0.5, 0.5);
  b.position.x -= 15;
  this.mesh.add(b);

  var u = new THREE.Mesh(geom.clone(), mat);
  u.scale.set(0.5, 0.5, 0.5);
  u.position.y += 15;
  this.mesh.add(u);

  var d = new THREE.Mesh(geom.clone(), mat);
  d.scale.set(0.5, 0.5, 0.5);
  d.position.y -= 15;
  this.mesh.add(d);


}

var enemiesArr = [];
var currentEnemies = 0;

function createEnemies(){
    var enemyCount = 30;
    for (var i = 0; i < enemyCount; i++) {
      var e = new Enemy();
      currentEnemies += enemiesArr.length;

      e.mesh.position.x = 300 + 1000*Math.random();;
      e.mesh.position.y =  -10 +100*Math.random();
      e.mesh.position.z = -400 + Math.random()*800;
      enemiesArr.push(e);
      scene.add(e.mesh);
    }

}

// 3D Models
var sea;
var airplane;
var sound1;

function createPlane() {
    propellerSpeed = 0.5;
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25, .25, .25);
  airplane.mesh.position.y = 100;
  defaultPlanePos = [airplane.mesh.position.x, airplane.mesh.position.y,airplane.mesh.position.z];
  console.log(window.location.pathname);
  // var sound1 = new THREE.PositionalAudio( listener );
  sound1 = new THREE.Audio( listener );

  audioLoader.load('./audio/flightmusic.ogg', function ( buffer ) {
      sound1.setBuffer( buffer );
      // sound1.setRefDistance( 20 );
      
  } );
  airplane.mesh.add( sound1 );

  scene.add(airplane.mesh);
  analyser1 = new THREE.AudioAnalyser( sound1, 32 );

}

function createSea() {
  sea = new Sea();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);
}

function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

function createBullet(x, y, z){
    var bullet = new Projectile();
    bullet.mesh.position.x = x;
    bullet.mesh.position.y = y;
    bullet.mesh.position.z = z;
    // var muzzleFlash = new THREE.AmbientLight(Colors.red, 0.9);;
    // muzzleFlash.position.set(bullet.mesh.position );
    // scene.add(muzzleFlash);
    //particle type, scale, position, amount, duration
    explodeParticle(new FireParticle(), 0.3, bullet.mesh.position, 3, 100);
    scene.add(bullet.mesh);
    projectiles.push(bullet)

    setTimeout(function(){
        scene.remove(bullet.mesh);}, 1000);
    // setTimeout(function(){
    //     scene.remove(muzzleFlash);}, 10);
}

function updateParticles(particleArray){
    //smokelike generation
    // for(var i = 0; i < particleArray.length; i++){
    //     particleArray[i].position.x += Math.random()*0.5;
    //     particleArray[i].position.y += Math.random()*0.5;
    //     particleArray[i].position.z += Math.random()*0.5;
    // }
    for(var i = 0; i < particleArray.length; i++){
        particleArray[i].position.x += -0.5 + Math.random()*1;
        particleArray[i].position.y += -0.5 + Math.random()*1;
        particleArray[i].position.z += -0.5 + Math.random()*1;
    }
}

function updateProjectiles(){
    for(var i = 0; i < projectiles.length; i++){
        projectiles[i].mesh.position.x += 10;
        for(var j = 0; j < enemiesArr.length; j++){
            //enemiesArr[j]
                var diffPos = enemiesArr[j].mesh.position.clone().sub(projectiles[i].mesh.position.clone());
                var d = diffPos.length();
                if (d<20){
                    scene.remove(enemiesArr[j].mesh);
                }

        }


    }

}



function loop() {
  updatePlane();
  updateProjectiles();
  updateParticles(fireParticles);
  sea.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .01;

  for(var i = 0; i < enemiesArr.length; i++){
      //
      // enemiesArr[i].mesh.position.x = airplane.mesh.position.x;
      // enemiesArr[i].mesh.position.y = airplane.mesh.position.y;
      // enemiesArr[i].mesh.position.z = airplane.mesh.position.z;
      enemiesArr[i].mesh.rotation.x += 0.05;
      enemiesArr[i].mesh.rotation.y += 0.05;
      enemiesArr[i].mesh.rotation.z += 0.05;

      if(enemiesArr[i].mesh.position.x < -500){
          enemiesArr[i].mesh.position.x = 1000;
      }else{
          enemiesArr[i].mesh.position.x -= 2;
      }
      // enemiesArr[i].mesh.position.y += 0.05;

      if(currentEnemies < 1){
          createEnemies();
      }
  }





  renderer.render(scene, camera);
  if(!paused){
    requestAnimationFrame(loop);

  }
}

function unTilt(fixSpeed){
	airplane.mesh.rotation.x -= airplane.mesh.rotation.x/fixSpeed;
	airplane.mesh.rotation.y -= airplane.mesh.rotation.y/fixSpeed;
	airplane.mesh.rotation.z -= airplane.mesh.rotation.z/fixSpeed;
}

function updatePlane() {
  if(shooting){
    createBullet(airplane.mesh.position.x, airplane.mesh.position.y-2, airplane.mesh.position.z+18);
    createBullet(airplane.mesh.position.x, airplane.mesh.position.y-2, airplane.mesh.position.z-18);
  }
    //engage first person controls
  if(!firstPerson){
      var targetY = normalize(mousePos.y, -.75, .75,   25, 175);
      var targetX = normalize(mousePos.x, -.75, .75, -100, 100);
      airplane.mesh.position.y = targetY;
      airplane.mesh.position.x = targetX;

  }
  else{
	  if(!turningLeft && !turningRight && !goingUp && !goingDown){
		  unTilt(8);

	  }


      //handles smooth updates
    if(turningLeft){
			if(airplane.mesh.rotation.y -turnSpeed < -0.60){
				if(airplane.mesh.rotation.y < 0.1){
					if(airplane.mesh.rotation.x  + 0.05 > 0.4){
						airplane.mesh.rotation.x = 0.4;
					}
					else{
						airplane.mesh.rotation.x += 0.05;
					}

					airplane.mesh.position.z += 5;
				}

				airplane.mesh.rotation.y = -0.60
			}
			else{
				if(airplane.mesh.rotation.y < 0.1){
					airplane.mesh.position.z += 5;
				}
				airplane.mesh.rotation.y -= turnSpeed;
			}

    }
    if(turningRight){
			if(airplane.mesh.rotation.y + turnSpeed > 0.60){
				if(airplane.mesh.rotation.y > 0.1){
					if(airplane.mesh.rotation.x  - 0.05 < -0.4){
						airplane.mesh.rotation.x = -0.4;
					}
					else{
						airplane.mesh.rotation.x -= 0.05;
					}
					airplane.mesh.position.z -= 5;

				}
				airplane.mesh.rotation.y = 0.60
			}
			else{
				if(airplane.mesh.rotation.y > 0.1){
					airplane.mesh.position.z -= 5;

				}
				airplane.mesh.rotation.y += turnSpeed;
			}

    }
    if(goingUp){
            airplane.mesh.position.y += altSpeed;
			if(airplane.mesh.rotation.z + 0.1> 0.35){
				airplane.mesh.rotation.z = 0.35
			}
			else{
				airplane.mesh.rotation.z += 0.1;
			}

    }
    if(goingDown){
			airplane.mesh.position.y -= altSpeed;
			if(airplane.mesh.rotation.z -0.01 < -0.35){
				airplane.mesh.rotation.z = -0.35;
			}
			else{
				airplane.mesh.rotation.z -= 0.1;
			}

    }


        updatePlaneView()
  }

// turn on and off propeller

  if(propellerOn){
      airplane.propeller.rotation.x += propellerSpeed;
  }
  else{
      airplane.propeller.rotation.x = 0;
  }


}

function updatePlaneView(){

	if(!unlockedCamera){
        if(normalCamera){
            camera.position.z = airplane.mesh.position.z;
            camera.position.x = airplane.mesh.position.x-100;
            camera.position.y = airplane.mesh.position.y+100;
            camera.lookAt(new THREE.Vector3(airplane.mesh.position.x+1000,  airplane.mesh.position.y-500, airplane.mesh.position.z));
        }


    //Aim down sights left
        if(adsLeftCamera){
          camera.position.z = airplane.mesh.position.z-10;
          camera.position.x = airplane.mesh.position.x-10;
          camera.position.y = airplane.mesh.position.y+20;
          camera.lookAt(new THREE.Vector3(airplane.mesh.position.x+1000,  airplane.mesh.position.y-500, airplane.mesh.position.z-100));
        }
        if(isometricCamera){
            // right isometric
                camera.position.z = airplane.mesh.position.z+40;
                camera.position.x = airplane.mesh.position.x-30;
                camera.position.y = airplane.mesh.position.y+30;
                camera.lookAt(new THREE.Vector3(airplane.mesh.position.x+1000,  airplane.mesh.position.y-500, airplane.mesh.position.z-500));
        }

	}

	else{
	  camera.position.x = 0;
      camera.position.z = 200;
      camera.position.y = 100;
      camera.lookAt(new THREE.Vector3(defaultPlanePos[0],  defaultPlanePos[1], defaultPlanePos[2]))
	}

}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max( Math.min(v, vmax), vmin );
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}



function init(event) {
  document.addEventListener('mousemove', handleMouseMove, false);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  createScene();
  createLights();
  createPlane();
  createSea();
  createSky();
  createEnemies();
	
	camera.add( listener );
	

  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };
var canShoot = true;

function handleMouseMove(event) {
    if(! firstPerson){
        var tx = -1 + (event.clientX / WIDTH)*2;
        var ty = 1 - (event.clientY / HEIGHT)*2;
        mousePos = {x:tx, y:ty};
    }

}

window.addEventListener('load', init, false);

function handleKeyUp(keyEvent){
    if(keyEvent.key == "a"){
        turningRight = false;
    }
    if(keyEvent.key == "d"){
        turningLeft = false;
    }
    if(keyEvent.key == "w"){
        goingUp = false;
    }
    if(keyEvent.key == "s"){
        goingDown = false;
    }
    if(keyEvent.key == " "){
        shooting = false;
    }
}
function handleKeyDown(keyEvent){
//https://javascript.info/keyboard-events
   //console.log(keyEvent.key);

   if(keyEvent.key == "p"){
     if(paused){
       paused = false;
       console.log("game resumed");
       requestAnimationFrame(loop);
     }
     else{
       paused = true;
       console.log("game paused");
     }
   }
   if(keyEvent.key == "c"){
	   if(unlockedCamera){
		   unlockedCamera = false;
	   }
	   else{
		   unlockedCamera = true;
	   }

   }
   if(keyEvent.key == " "){
        shooting = true;

  }
  if(keyEvent.key == "h"){
      if(propellerOn){
        propellerOn = false;
        console.log("Properller stopped");

      }
      else{
        propellerOn = true;
        console.log("Properller started");
      }
  }
  if(keyEvent.key == "ArrowLeft"){
      propellerSpeed += 0.2;

  }
  if(keyEvent.key == "ArrowRight"){
      propellerSpeed -= 0.2;

  }
	
  if(keyEvent.key == "m"){
  	
	if(playingMusic == false){
		sound1.play();
	}
	  else{
		  sound1.pause();
	  }
	  playingMusic = !playingMusic;
	  
  }

  // if(keyEvent.key == "arrow")
   if(keyEvent.key == "x"){
       //removes old sky
       scene.remove(sky.mesh);
       if(firstPerson){
           firstPerson = false;
           console.log("First person off");
           camera.position.x = 0;
           camera.position.z = 200;
           camera.position.y = 100;
           //reset to captured values from createPlane()
           camera.lookAt(new THREE.Vector3(defaultPlanePos[0],  defaultPlanePos[1], defaultPlanePos[2]))
       }
       else{
           firstPerson = true;
           console.log("First person on");
           //add camera offset above plane and look forward
           altitude = airplane.mesh.position.y;
		   updatePlaneView();
       }
       //adds new fixed sky for new perspective
       createSky();
       scene.add(sky.mesh);

   }
   if(keyEvent.key == "1"){
       isometricCamera = true;
       normalCamera = false;
       adsLeftCamera = false;
   }
   if(keyEvent.key == "2"){
       adsLeftCamera = true;
       normalCamera = false;
       isometricCamera = false;
   }
   if(keyEvent.key == "3"){
       normalCamera = true;
       adsLeftCamera = false;
       isometricCamera = false;
   }

   if(keyEvent.key == "w"){
       goingUp = true;


   }

   if(keyEvent.key == "s"){
       goingDown = true;

   }


     if(keyEvent.key == "a"){
         turningRight = true;

     }

     if(keyEvent.key == "d"){
         turningLeft = true;


    }
}
