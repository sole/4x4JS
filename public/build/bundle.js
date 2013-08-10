;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
	var socket;

	this.connect = function(address) {
		socket = io.connect(address);
	};
};

},{}],2:[function(require,module,exports){
module.exports = {
	Player: require('./Player'),
	OSC: require('./OSC')
};

},{"./OSC":1,"./Player":3}],3:[function(require,module,exports){


module.exports = function() {

	this.loadSong = function(data) {
		console.warn('TODO load song', data);
	};

	this.buildEvents = function() {
		console.warn('TODO build events');
	};

};

},{}],4:[function(require,module,exports){
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

},{"./Orxatron/":2}],5:[function(require,module,exports){
window.addEventListener('DOMComponentsLoaded', function() {

	var app = require('./app');
	app.start();

}, false);

},{"./app":4}]},{},[5])
;