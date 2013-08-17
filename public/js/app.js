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
	console.warn('TODO initialiseGear');
	var g = [];
	// Audio gear
	// ----------
	// TODO pads
	// var Colchonator = require('./gear/Colchonator');
	// var pads = new Colchonator(audioContext);
	// g.push(pads);

	// TODO bass
	var Bajotron = require('./gear/Bajotron');
	var bass = new Bajotron(audioContext, { portamento: false, waveType: ['square', 'triangle'] });
	g.push(bass);

	// TODO drum machine
	
	// TODO tmp, should have some postpro+comp etc
	g.forEach(function(instrument) {
		instrument.output.connect(audioContext.destination);
	});

	// This is ULTRA CREEPY
	/*setInterval(function() {
		// bass.noteOff();
		bass.noteOn(440 + Math.random() * 1000);
	}, 1000);*/

	/*setInterval(function() {
		var noteNumber = 32 + (Math.random() * 10) | 0;
		bass.noteOn(noteNumber);
	}, 1000);*/

	/*var lastNote = 0;
	setInterval(function() {
		var noteNumber = 32 + lastNote * 12;
		bass.noteOn(noteNumber);
		lastNote = lastNote === 0 ? 1 : 0;
	}, 250);*/

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
