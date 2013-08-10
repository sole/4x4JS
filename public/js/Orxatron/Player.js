

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
