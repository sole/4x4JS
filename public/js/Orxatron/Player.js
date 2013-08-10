function loadSong(data) {
	console.log('load song', data);
}

module.exports = function() {
	this.loadSong = loadSong;
};
