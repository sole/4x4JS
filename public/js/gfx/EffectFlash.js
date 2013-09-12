"use strict";

var EffectFlash = function ( renderer ) {

	Effect.call( this );

	var internalSequencer = new Sequencer(),
		easing, camera, scene, geometry, mesh, material;
	
	this.init = function() {
		console.log('Flash init');

		var width = 1,
			height = 1,
			halfW = width * 0.5,
			halfH = height * 0.5;

		easing = TWEEN.Easing.Quadratic.Out; 

		scene = new THREE.Scene();

		camera = new THREE.OrthographicCamera( -halfW, halfW, halfH, -halfH, 1, 10000 );
		camera.position.z = 1000;
		camera.lookAt( new THREE.Vector3() );
		
		geometry = new THREE.PlaneGeometry(width, height, 1, 1);
		material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		material.depthWrite = false;
		material.opacity = 0;
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = 0;
		
		scene.add(camera);
		scene.add(mesh);

	};
	
	this.update = function ( progress, delta, time ) {
		
		internalSequencer.update( time );
		renderer.render( scene, camera );

	};

	var FlashUpdater = function() {};
	FlashUpdater.prototype = Object.create( SequencerItem.prototype );
	FlashUpdater.prototype.update = function( progress, delta, time ) {
		material.opacity = 0.15 * (1 - easing( progress ));
	}

	this.processEvents = function( startTime, endTime, eventsList ) {
		
		for(var i = 0, e; i < eventsList.length, e = eventsList[i]; i++) {

			// Skip
			if(e.timestamp < startTime) {
				continue;
			} else if(e.timestamp > endTime) {
				break;
			}

			// Listens to 'hat' instrument only on C-6 note (72)
			if(e.instrument == 3 && e.note == 72) {

				var updater = new FlashUpdater();

				var t0 = e.timestamp, tend = t0 + 0.1;
				internalSequencer.add( updater, t0, tend, 0 );

			}

		}

	}

};

EffectFlash.prototype = new Effect();
EffectFlash.prototype.constructor = EffectFlash;
