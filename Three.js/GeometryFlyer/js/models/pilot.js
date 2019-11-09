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

	var geomBeanie = new THREE.BoxGeometry(19, 10, 19, 1, 1, 1);
    var matBeanie  = new THREE.MeshPhongMaterial(
                             { color : 0x6d727a,
                             shading : THREE.FlatShading });

  var beanie = new THREE.Mesh(geomBeanie, matBeanie);
	beanie.position.y = 55;
	beanie.castShadow = true;
  beanie.receiveShadow = true;
	this.mesh.add(beanie);

	return this.mesh;
}
