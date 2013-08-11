var Pattern = require('./Pattern');

function Player() {

	'use strict';

	var scope = this,
		secondsPerRow,
		secondsPerTick,
		_isPlaying = false,
		DEFAULT_BPM = 100;

	this.bpm = DEFAULT_BPM;
	this.linesPerBeat = 4;
	this.ticksPerLine = 12;
	this.currentRow = 0;
	this.currentOrder = 0;
	this.currentPattern = 0;
	this.repeat = true;
	this.finished = false;

	this.voices = [];
	this.patterns = [];
	this.orders = [];
	this.eventsList = [];
	this.nextEventPosition = 0;
	this.timePosition = 0;
	this.position = 0;

	// ~~~

	function updateRowTiming() {
		secondsPerRow = 60.0 / (scope.linesPerBeat * scope.bpm);
		secondsPerTick = secondsPerRow / scope.ticksPerLine;
	}

	// This "unpacks" the song data, which only specifies non null values
	this.loadSong = function(data) {
		console.warn('TODO load song', data);

		scope.bpm = data.bpm || DEFAULT_BPM;

		updateRowTiming();

		// Orders
		scope.orders = data.orders.slice(0);

		// Tracks config
		var tracks = data.tracks.slice(0);

		// (packed) patterns
		scope.patterns = [];
		data.patterns.forEach(function(pp) {
			var pattern = new Pattern(pp.rows, tracks);
			var patternData = pp.data;

			for(var rowNumber in patternData) {

				var rowData = patternData[rowNumber];
				console.log('row data', rowData);

				rowData.forEach(function(trackData, trackIndex) {

					var patternTrackLine = pattern.get(rowNumber, trackIndex);
					var trackNumColumns = tracks[trackIndex];
					console.log('track #', trackIndex, trackNumColumns);
					for(var i = 0; i < trackNumColumns; i++) {
						patternTrackLine.cells[i].setData(trackData[i]);
					}
				
				});
			}
			

			scope.patterns.push(pattern);
		});


		scope.patterns.forEach(function(pat, idx) {
			console.log('Pattern #', idx);
			console.log(pat.toString());
		});

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

}

module.exports = Player;
