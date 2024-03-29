// Student name: Leonardo Ascenzi


var propellerOn = true;
var paused = false;
var firstPerson = false;
var altitude = 0;

var turningLeft = false;
var turningRight = false;
var goingUp = false;
var goingDown = false;

var turnSpeed = 0.05;
var altSpeed = 5;

var unlockedCamera = false;
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
    renderer, container;

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
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
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

  scene.add(hemisphereLight);
  scene.add(shadowLight);

}

var Pilot = function(){
	this.mesh      = new THREE.Object3D();
	this.mesh.name = "Pilot";

	var geomEye = new THREE.BoxGeometry(3, 3, 3, 1, 1, 1);
    var matEye  = new THREE.MeshPhongMaterial(
                             { color : 0x000000,
                             shading : THREE.FlatShading });

    var eye = new THREE.Mesh(geomEye, matEye);

    eye.castShadow = true;
    eye.receiveShadow = true;

    eye.position.y = 45;
	eye.position.x = 10;
	eye.position.z = -5;
	var eye2 = eye.clone();

	eye2.position.x = 10;
	eye2.position.z = 5;
    this.mesh.add(eye);
	this.mesh.add(eye2);



	//nose

	var geomNose = new THREE.BoxGeometry(3, 3, 3, 1, 1, 1);
    var matNose  = new THREE.MeshPhongMaterial(
                             { color : Colors.pink,
                             shading : THREE.FlatShading });

    var nose = new THREE.Mesh(geomNose, matNose);

    nose.castShadow = true;
    nose.receiveShadow = true;

    nose.position.y = 40;
	nose.position.x = 10;
	nose.position.z = 0;
	this.mesh.add(nose);


	//beanie
	var geomBeanie = new THREE.BoxGeometry(22, 10, 22, 1, 1, 1);
    var matBeanie  = new THREE.MeshPhongMaterial(
                             { color : 0x6d727a,
                             shading : THREE.FlatShading });

    var beanie = new THREE.Mesh(geomBeanie, matBeanie);
	beanie.position.y = 50;
	beanie.castShadow = true;
    beanie.receiveShadow = true;
	this.mesh.add(beanie);

	var geomBeanie = new THREE.BoxGeometry(19, 20, 19, 1, 1, 1);
    var matBeanie  = new THREE.MeshPhongMaterial(
                             { color : 0x6d727a,
                             shading : THREE.FlatShading });

    var beanie = new THREE.Mesh(geomBeanie, matBeanie);
	beanie.position.y = 50;
	beanie.castShadow = true;
    beanie.receiveShadow = true;
	this.mesh.add(beanie);

	return this.mesh;
}

var geomCockpit;
var AirPlane = function(){

  this.mesh      = new THREE.Object3D();
  this.mesh.name = "airPlane";

	  // Create the Cabin
  var geomHead = new THREE.BoxGeometry(20, 20, 20, 1, 1, 1);
  var matHead  = new THREE.MeshPhongMaterial(
                             { color : Colors.pink,
                             shading : THREE.FlatShading });

  var head = new THREE.Mesh(geomHead, matHead);

  head.castShadow = true;
  head.receiveShadow = true;

  head.position.y = 40;
  this.mesh.add(head);

  this.mesh.add(Pilot());

  // Create the Cabin
  geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
  var matCockpit  = new THREE.MeshPhongMaterial(
                             { color : Colors.red,
                             shading : THREE.FlatShading });
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);

  cockpit.castShadow = true;
  cockpit.receiveShadow = true;

  this.mesh.add(cockpit);


  // Create Engine
  var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
  var matEngine  = new THREE.MeshPhongMaterial(
                            { color : Colors.white,
                            shading : THREE.FlatShading });

  var engine = new THREE.Mesh(geomEngine, matEngine);

  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;

  this.mesh.add(engine);


   // Create Tailplane
  var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  var matTailPlane  = new THREE.MeshPhongMaterial(
                               { color : Colors.red,
                               shading : THREE.FlatShading });

  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);

  tailPlane.position.set(-35, 25, 0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;

  this.mesh.add(tailPlane);


  // Create Wing
  var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
  var matSideWing  = new THREE.MeshPhongMaterial(
                              { color : Colors.red,
                              shading : THREE.FlatShading });

  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0, 0, 0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;

  this.mesh.add(sideWing);


  // Propeller
  var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  var matPropeller  = new THREE.MeshPhongMaterial(
                            { color : Colors.brown,
                            shading : THREE.FlatShading });
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades
  var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
  var matBlade = new THREE.MeshPhongMaterial(
                           { color : Colors.brownDark,
                           shading : THREE.FlatShading });

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8, 0, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;

  this.propeller.add(blade);
  this.propeller.position.set(50, 0, 0);

  this.mesh.add(this.propeller);

};



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
    var h = 750 + Math.random() * 200;

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
    shading : THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;
}


Cloud = function() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.CubeGeometry(20, 20, 20);

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


// 3D Models
var sea;
var airplane;

function createPlane() {
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25, .25, .25);
  airplane.mesh.position.y = 100;
  defaultPlanePos = [airplane.mesh.position.x, airplane.mesh.position.y,airplane.mesh.position.z];
  scene.add(airplane.mesh);
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

function loop() {
  updatePlane();
  sea.mesh.rotation.z += .005;
  sky.mesh.rotation.z += .01;
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
			updatePlaneView()


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
			updatePlaneView()
        }
        if(goingUp){
            airplane.mesh.position.y += altSpeed;
			if(airplane.mesh.rotation.z + 0.1> 0.35){
				airplane.mesh.rotation.z = 0.35
			}
			else{
				airplane.mesh.rotation.z += 0.1;
			}

            updatePlaneView()
        }
        if(goingDown){
			airplane.mesh.position.y -= altSpeed;
			if(airplane.mesh.rotation.z -0.01 < -0.35){
				airplane.mesh.rotation.z = -0.35;
			}
			else{
				airplane.mesh.rotation.z -= 0.1;
			}


            updatePlaneView()
        }
  }

// turn on and off propeller
  if(propellerOn){
      airplane.propeller.rotation.x += 0.5;
  }
  else{
      airplane.propeller.rotation.x += 0;
  }


}

function updatePlaneView(){

	if(!unlockedCamera){
		camera.position.z = airplane.mesh.position.z;
    	camera.position.x = airplane.mesh.position.x-100;
    	camera.position.y = airplane.mesh.position.y+100;
    	camera.lookAt(new THREE.Vector3(airplane.mesh.position.x+1000,  airplane.mesh.position.y-500, airplane.mesh.position.z));
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
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

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
     if(propellerOn){
       propellerOn = false;
       console.log("Properller stopped");
     }
     else{
       propellerOn = true;
       console.log("Properller started");
     }
  }
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
