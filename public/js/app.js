var audioContext,
	renderer,
	deck;

var Orxatron = require('./Orxatron/'),
	gear;

function start() {

	console.log('app start, yo!');

	var rendererContainer = document.getElementById('rendererContainer');

	deck = document.querySelector('x-deck');

	// load song ajax
	$.ajax({
		url: '/build/data/song.json',
		type: 'GET',
		contentType: 'text/json',
		success: onSongDataLoaded,
		error: function() {
			console.log('ERROR', arguments);
		}
	});

	player = new Orxatron.Player();
	osc = new Orxatron.OSC();

}


function onSongDataLoaded(data) {

	player.loadSong(data);
	player.buildEvents();

	audioContext = new AudioContext();
	gear = initialiseGear(audioContext);
	player.gear = gear; // TODO setter?

	setupGearPlayerListeners(gear, player);
	setupDeck(player, deck);
	setupOSC(gear, player, osc);

	setupKeyboardAndTransport();
	osc.connect('/');

}


function initialiseGear(audioContext) {
	
	var g = [];

	// Audio gear
	// ----------
	var Mixer = require('./gear/Mixer');
	var mixer = new Mixer(audioContext);
	mixer.output.connect(audioContext.destination);
	mixer.setGlobalGain(0.25);
	
	// 0 / BASS 
	var Bajotron = require('./gear/Bajotron');
	var bass = new Bajotron(audioContext, {
		portamento: false,
		waveType: ['square', 'triangle'],
		octaves: [-2, -1] 
	});
	g.push(bass);

	// 1 / PAD
	var Colchonator = require('./gear/Colchonator');
	var pad = new Colchonator(audioContext, {
		reverbImpulse: 'data/impulseResponses/cave.ogg'
	});
	pad.setWetAmount(1.0);
	g.push(pad);
	
	// 2 / DRUM MACHINE
	var Porrompom = require('./gear/Porrompom');
	var p808 = 'data/samples/808/';
	var dm808 = new Porrompom(audioContext, {
		mappings: {
			'C-4': p808 + 'bassdrum.wav',
			'C#4': p808 + 'snaredrum.wav',
			'D-4': p808 + 'clap.wav',
			'D#4': p808 + 'claves.wav',
			'E-4': p808 + 'cowbell.wav',
			'F-4': p808 + 'hihat_closed.wav',
			'F#4': p808 + 'hihat_open.wav',
			'G-4': p808 + 'maracas.wav',
			'G#4': p808 + 'rimshot.wav',
			'A-4': p808 + 'tom_low.wav'
		}
	});
	g.push(dm808);

	// Plug instruments into the mixer
	g.forEach(function(instrument, index) {
		console.log('plug', instrument, index);
		mixer.plug(index, instrument.output);
	});
	mixer.setChannelGain(0, 0.1);
	mixer.setChannelGain(1, 0.1);
	//mixer.setChannelGain(1, 0.5);
	//mixer.setChannelGain(1, 0);
	
	var Oscilloscope = require('./gear/Oscilloscope');
	var oscilloscope = new Oscilloscope(audioContext);
	mixer.output.connect(oscilloscope.input);
	oscilloscope.domElement.id = 'oscilloscope';
	document.body.appendChild(oscilloscope.domElement);

	// GFX gear
	// --------
	// TODO gfx gear!
	
	return g;
}


function setupGearPlayerListeners(gear, player) {
	// listeners player <-> gear
	
		
	
	console.warn('TODO setupGearPlayerListeners');
}


function setupOSC(gear, player, osc) {

	var prefix = '\/quneo\/'; // Because I'm lazy.

	// osc.input -> gear
	// -----------------
	osc.on(prefix + 'pads\/(\\d+)\/drum\/pressure', null, function(match, value) {
		console.log('pad pressure', value, match);
	});

	// TODO: "mixer" -> sample cue points (granular...)
	// TODO: up/down (left/right) to select which sample to play, and trigger it
	

	// osc.input -> player
	// -------------------
	// __ PLAY -> player.play
	osc.on(prefix + 'transport\/2\/note_velocity', 127, play);
	// __ STOP -> player.pause
	osc.on(prefix + 'transport\/1\/note_velocity', 127, pause);


	// player -> osc.output
	// --------------------
	console.warn('TODO setupOSC');
	// TODO: flash play button to the beat
	// TODO: flash stop button at 0.5
	// TODO: use pad columns/grid as pattern/line indicator
	
	// Turn columns on/off as the song is played
	var getLedPath = (function() {
		
		var leds = {};

		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				var base = j * 2 + i * 16;
				var padNumber = i * 4 + j;
				var path = '/quneo/leds/pads/' + padNumber + '/';
				leds[base] = path + 'SW/';
				leds[base + 1] = path + 'SE/';
				leds[base + 8] = path + 'NW/';
				leds[base + 9] = path + 'NE/';
			}
		}

		// type = 'green' or 'red'
		return function(ledIndex, type) {
			if(type === undefined) {
				type = '';
			}
			return leds[ledIndex] + type;
		};

	})();

	var getColumnLeds = (function() {

		var columnLeds = {};
		
		for(var i = 0; i < 8; i++) {
			var column = [];
			for(var j = 0; j < 8; j++) {
				column.push(i + j * 8);
			}
			columnLeds[i] = column;
			console.log(i, column);
		}
		
		return function(col) {
			return columnLeds[col];
		};

	})();

	var lastColumn = null;
	player.addEventListener('row_change', function(ev) {
		var columnNumber = ev.row % 8;
		var columnLeds = getColumnLeds(columnNumber);

		if(lastColumn !== null) {
			// Turn older off
			var prevLeds = getColumnLeds(lastColumn);
			prevLeds.forEach(function(index) {
				osc.send(getLedPath(index, 'red'), 0);
				osc.send(getLedPath(index, 'green'), 0);
			});
		}

		columnLeds.forEach(function(index) {
			var path = getLedPath(index, 'red');
			osc.send(path, 0.5);
		});

		lastColumn = columnNumber;

	}, false);


	// TODO: vumeters?

}


function setupDeck(player, deck) {
	// player -> deck
	console.warn('TODO setupDeck');
}


function setupKeyboardAndTransport() {
	// Just in case OSC is not available!
	$('#play').on('click', play);
	$('#pause').on('click', pause);
}


function play() {
	if(!player.isPlaying()) {
		player.play();
	}
}


function pause() {
	player.pause();
}

module.exports = {
	start: start
};
