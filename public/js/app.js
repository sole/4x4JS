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
	// osc.input -> gear
	// osc.input -> player
	//	PLAY -> player.play
	//	STOP -> player.pause
	// player -> osc.output
	console.warn('TODO setupOSC');
}


function setupDeck(player, deck) {
	// player -> deck
	console.warn('TODO setupDeck');
}


module.exports = {
	start: start
};
