var Projectile = function(){

  this.mesh      = new THREE.Object3D();
  this.mesh.name = "Projectile";


  var geomProjMiddle = new THREE.BoxGeometry(8, 2, 2, 1, 1, 1);
  var matProjMiddle  = new THREE.MeshPhongMaterial(
                             { color : 0x000000,
                             shading : THREE.FlatShading });

  var projMiddle = new THREE.Mesh(geomProjMiddle, matProjMiddle);

  projMiddle.castShadow = false;
  projMiddle.receiveShadow = false;

  this.mesh.add(projMiddle);

};
