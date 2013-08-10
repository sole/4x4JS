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
