var Effect = require('./Effect');

// TODO extract away
function r(radius) {
	return (Math.random() - 0.5) * radius;
}

var EffectCube = function ( renderer ) {

	Effect.call( this );

	var scene,
		camera,
		cameraTarget,
		mesh;

	this.init = function() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100000);
		cameraTarget = new THREE.Vector3();

		this.setSize(window.innerWidth, window.innerHeight);

		var material = new THREE.MeshBasicMaterial({ wireframe: true, wireframeLinewidth: 2, color: 0x000000 });
		var geometry = new THREE.CubeGeometry(10, 10, 10);

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		camera.position.set(15, 0, 15);
		camera.lookAt(cameraTarget);

	};

	this.setSize = function(w, h) {

		if(camera) {
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}

	};
	
	this.update = function ( time ) {
		//var dist = 15;
		//var t = time * 300;

		mesh.rotation.y = Date.now() * 0.001;

		camera.lookAt(cameraTarget);
		renderer.render(scene, camera);
	};

};

EffectCube.prototype = new Effect();
EffectCube.prototype.constructor = EffectCube;

module.exports = EffectCube;


