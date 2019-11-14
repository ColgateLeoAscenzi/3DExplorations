
var FireParticle = function(){
    var fireColors = [0xe6442c, 0xc22811,0xfc3217,0xffcd38, 0xf09000];
    var chosenColor = fireColors[Math.floor(Math.random()*5)];
    this.mesh      = new THREE.Object3D();
    this.mesh.name = "fire";
    this.mesh.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
                            new THREE.MeshPhongMaterial(
                           { color : chosenColor})));
    // this.material = new THREE.MeshPhongMaterial( { color : fireColors[Math.random()*5]});
}
//takes a type of particle, how big, a position to spawn it, how many to spawn and how long they should last
//then returns an array of meshes and adds them to the scene
function explodeParticle(particle, scale, position, amount, duration){
    //sends out a random amount of a particle
    for(var i = 0; i < amount; i++){
        var tempMesh = particle.mesh;
        tempMesh.scale.x = scale;
        tempMesh.scale.y = scale;
        tempMesh.scale.z = scale;
        tempMesh.position.x = position.x+10;
        tempMesh.position.y = position.y;
        tempMesh.position.z = position.z;
        tempMesh.rotation.x = Math.random();
        tempMesh.rotation.y = Math.random();
        tempMesh.rotation.z = Math.random();
        scene.add(tempMesh);
        fireParticles.push(tempMesh);
        setTimeout(function(){scene.remove(tempMesh)}, duration);
    }
}
