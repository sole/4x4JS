var renderer,
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

	console.log('song', data);

	player.loadSong(data);
	player.buildEvents();

	gear = initialiseGear();
	player.gear = gear; // TODO setter?

	setupGearPlayerListeners(gear, player);
	setupDeck(player, deck);
	setupOSC(gear, player, osc);

	setupKeyboardAndTransport();
	osc.connect('/');

}


function initialiseGear() {
	console.warn('TODO initialiseGear');
	return [];
}


function setupGearPlayerListeners(gear, player) {
	// listeners player <-> gear
	console.warn('TODO setupGearPlayerListeners');
}


function setupOSC(gear, player, osc) {

	var prefix = '\/quneo\/'; // Because I'm lazy.

	// osc.input -> gear
	osc.on(prefix + 'pads\/(\\d+)\/drum\/pressure', null, function(match, value) {
		console.log('pad pressure', value, match);
	});
	
	// osc.input -> player
	//	PLAY -> player.play
	// osc.on('/quneo/transport/2/note_velocity', 127, play);
	osc.on(prefix + 'transport\/2\/note_velocity', 127, play);
	//	STOP -> player.pause
	// player -> osc.output
	console.warn('TODO setupOSC');

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
