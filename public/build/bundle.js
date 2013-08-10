;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
	var socket;
	var listeners = [];

	function onMessage(data) {
		//console.log(data);

		var address = data[0];
		var value = data[1];

		findMatch(address, value);

	}

	function findMatch(address, value) {
		var listener, match;

		for(var i = 0; i < listeners.length; i++) {
			
			listener = listeners[i];
			match = listener.regexp.exec(address);

			if(match) {

				if(listener.expectedValue === null || 
					listener.expectedValue !== null && listener.expectedValue === value) {

					console.log('MATCH', address, listener.regexp, match, 'expected', listener.expectedValue, 'actual value', value);
					listener.callback(match, value);

					break;

				}

			}
		}

		
	}



	this.connect = function(address) {

		socket = io.connect(address);

		socket.on('osc', onMessage);

	};

	
	this.on = function(address, expectedValue, callback) {
		
		var re = new RegExp(address, 'g');

		console.log(address, '->', re);
		
		var listener = {
			regexp: re,
			expectedValue: expectedValue,
			callback: callback
		};

		listeners.push(listener);

	};

	
};

},{}],2:[function(require,module,exports){
module.exports = {
	Player: require('./Player'),
	OSC: require('./OSC')
};

},{"./OSC":1,"./Player":3}],3:[function(require,module,exports){


module.exports = function() {

	var _isPlaying = false;

	this.loadSong = function(data) {
		console.warn('TODO load song', data);
	};

	this.buildEvents = function() {
		console.warn('TODO build events');
	};

	this.play = function() {
		console.warn('TODO play');
		_isPlaying = true;
	};

	this.isPlaying = function() {
		return _isPlaying;
	};

	this.pause = function() {
		console.warn('TODO pause');
		_isPlaying = false;
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

},{"./Orxatron/":2}],5:[function(require,module,exports){
window.addEventListener('DOMComponentsLoaded', function() {

	var app = require('./app');
	app.start();

}, false);

},{"./app":4}]},{},[5])
;