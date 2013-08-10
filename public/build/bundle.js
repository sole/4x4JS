;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	Player: require('./Player')
};

},{"./Player":2}],2:[function(require,module,exports){
function loadSong(data) {
	console.log('load song', data);
}

module.exports = function() {
	this.loadSong = loadSong;
};

},{}],3:[function(require,module,exports){
var renderer,
	deck;

var Orxatron = require('./Orxatron/');

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
}

function onSongDataLoaded(data) {
	console.log('song', data);

	player.loadSong(data);
}

module.exports = {
	start: start
};

},{"./Orxatron/":1}],4:[function(require,module,exports){
window.addEventListener('DOMComponentsLoaded', function() {

	var app = require('./app');

	console.log('hey');

	app.start();

}, false);

},{"./app":3}]},{},[4])
;