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


  var geomGun = new THREE.BoxGeometry(65, 8, 8, 1, 1, 1);
  var matGun  = new THREE.MeshPhongMaterial(
                              { color : 0x000000,
                              shading : THREE.FlatShading });

  var gun1 = new THREE.Mesh(geomGun, matGun);
  gun1.position.set(10,-8,75);
  gun1.castShadow = true;
  gun1.receiveShadow = true;

  this.mesh.add(gun1);

  var geomGun2 = new THREE.BoxGeometry(65, 8, 8, 1, 1, 1);
  var matGun2  = new THREE.MeshPhongMaterial(
                              { color : 0x000000,
                              shading : THREE.FlatShading });

  var gun2 = new THREE.Mesh(geomGun2, matGun2);
  gun2.position.set(10,-8,-75);
  gun2.castShadow = true;
  gun2.receiveShadow = true;

  this.mesh.add(gun2);



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
