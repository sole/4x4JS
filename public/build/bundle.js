;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MIDIUtils = (function() {

	var noteMap = {};
	var noteNumberMap = [];
	var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
	
	for(var i = 0; i < 127; i++) {

		var index = i + 9, // The first note is actually A-0 so we have to transpose up by 9 tones
			key = notes[index % 12],
			octave = (index / 12) | 0;

		if(key.length === 1) {
			key = key + '-';
		}

		key += octave;

		noteMap[key] = i + 1; // MIDI notes start at 1
		noteNumberMap[i + 1] = key;

	}


	return {
		noteNameToNoteNumber: function(name) {
			return noteMap[name];
		},

		noteNumberToFrequency: function(note) {
			return 440.0 * Math.pow(2, (note - 49.0) / 12.0);
		},

		noteNumberToName: function(note) {
			return noteNumberMap[note];
		}
	};

})();

try {
	module.exports = MIDIUtils;
} catch(e) {
}


},{}],2:[function(require,module,exports){
// StringFormat.js r3 - http://github.com/sole/StringFormat.js
var StringFormat = {

	pad: function(number, minimumLength, paddingCharacter) {

		var sign = number >= 0 ? 1 : -1;

		minimumLength = minimumLength !== undefined ? minimumLength : 1,
		paddingCharacter = paddingCharacter !== undefined ? paddingCharacter : ' ';

		var str = Math.abs(number).toString(),
			actualMinimumLength = minimumLength;

		if(sign < 0) {
			actualMinimumLength--;
		}

		while(str.length < actualMinimumLength) {
			str = paddingCharacter + str;
		}

		if(sign < 0) {
			str = '-' + str;
		}

		return str;

	},
	
	toFixed: function(number, numberDecimals) {

		return (+number).toFixed( numberDecimals );

	},
	
	secondsToHHMMSS: function( _seconds ) {

		var hours, minutes, seconds = _seconds;

		hours = Math.floor( seconds / 3600 );
		seconds -= hours * 3600;

		minutes = Math.floor( seconds / 60 );
		seconds -= minutes * 60;

		seconds = Math.floor( seconds );

		return StringFormat.pad( hours, 2, '0' ) + ':' + StringFormat.pad( minutes, 2, '0' ) + ':' + StringFormat.pad( seconds, 2, '0' );

	}
};

// CommonJS module format etc
try {
	module.exports = StringFormat;
} catch( e ) {
}


},{}],3:[function(require,module,exports){
// Extract relevant information for our purposes only
function renoiseToOrxatron(json) {
	var j = {};
	var song = json.RenoiseSong;

	j.bpm = song.GlobalSongData.BeatsPerMin;
	j.orders = [];

	// Order list
	var entries = song.PatternSequence.SequenceEntries.SequenceEntry;

	// It's an array -> more than one entry
	if(entries.indexOf) {
		entries.forEach(function(entry) {
			j.orders.push(entry.Pattern | 0);
		});
	} else {
		if(entries.Pattern !== undefined) {
			j.orders.push(entry.Pattern | 0);
		}
	}

	// find out how many tracks and how many columns per track
	var patterns = song.PatternPool.Patterns.Pattern;
	var tracksSettings = [];

	patterns.forEach(function(pattern) {

		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			
			if(tracksSettings[trackIndex] === undefined) {
				tracksSettings[trackIndex] = 0;
			}

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line) {
				var noteColumns = line.NoteColumns.NoteColumn;
				var numColumns;

				if(noteColumns.indexOf) {
					numColumns = noteColumns.length;
				} else {
					numColumns = 1;
				}

				tracksSettings[trackIndex] = Math.max(numColumns, tracksSettings[trackIndex]);
			});

			// But there's always a minimum of one column per track
			tracksSettings[trackIndex] = Math.max(1, tracksSettings[trackIndex]);

		});

	});

	j.tracks = tracksSettings;

	// Now extract notes and stuff we care about
	j.patterns = [];

	patterns.forEach(function(pattern) {
		var p = {};
		var data = [];
		
		p.tracks = data;
		p.rows = pattern.NumberOfLines | 0;
		
		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			var trackData = [];

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line) {
				var rowNumber = line.$.index | 0;
				var noteColumns = line.NoteColumns.NoteColumn;
				var lineData = {
					row: rowNumber,
					columns: []
				};
				
				if(noteColumns.indexOf === undefined) {
					noteColumns = [ noteColumns ];
				}

				noteColumns.forEach(function(column, columnIndex) {
					var columnData = {};
					
					columnData.note = column.Note || null;

					// TODO when instrument is ..
					columnData.instrument = column.Instrument | 0;

					if(column.Volume !== undefined && column.Volume !== '..') {
						columnData.volume = column.Volume | 0;
					}

					lineData.columns.push(columnData);
				});
				
				trackData.push(lineData);

			});

			p.tracks.push(trackData);

		});
		
		j.patterns.push(p);
	});


	return j;
}

module.exports = {
	renoiseToOrxatron: renoiseToOrxatron
};

},{}],4:[function(require,module,exports){
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

		// console.log(address, '->', re);
		
		var listener = {
			regexp: re,
			expectedValue: expectedValue,
			callback: callback
		};

		listeners.push(listener);

	};

	
};

},{}],5:[function(require,module,exports){
module.exports = {
	DataUtils: require('./DataUtils'),
	Player: require('./Player'),
	OSC: require('./OSC')
};

},{"./DataUtils":3,"./OSC":4,"./Player":8}],6:[function(require,module,exports){
var Line = require('./TrackLine');
var StringFormat = require('stringformat.js');

function Pattern(rows, tracksConfig) {

	var scope = this,
		data = initEmptyData(rows, tracksConfig);

	//

	function initEmptyData(rows, tracksConfig) {

		var d = [];

		for(var i = 0; i < rows; i++) {

			var row = [];

			for(var j = 0; j < tracksConfig.length; j++) {

				var trackNumColumns = tracksConfig[j];

				var line = new Line(trackNumColumns);
				row.push(line);

			}

			d.push(row);

		}

		return d;
	}

	Object.defineProperties(this, {
		numLines: {
			get: function() { return data.length; }
		}
	});

	this.get = function(row, track) {
		return data[row][track];
	};

	this.toString = function() {
		var columnSeparator = ' | ';
		var trackSeparator = ' || ';
		var out = '';

		for(var i = 0; i < scope.numLines; i++) {
			out += StringFormat.pad(i, 3) + ' ';

			var row = data[i];

			for(var j = 0; j < row.length; j++) {
				
				var line = row[j];
				var lineToStr = [];

				for(var k = 0; k < line.cells.length; k++) {
					var cell = line.cells[k];
					lineToStr.push(cell.toString());
				}

				out += lineToStr.join(columnSeparator);

				out += trackSeparator;
			}

			out += '\n';
		}

		return out;
	};
}

module.exports = Pattern;

},{"./TrackLine":9,"stringformat.js":2}],7:[function(require,module,exports){
var StringFormat = require('stringformat.js');
var MIDIUtils = require('midiutils');

function PatternCell(data) {

	var scope = this;

	data = data || {};
	setData(data);
	
	// Bulk data setting
	function setData(d) {

		scope.note = d.note !== undefined ? d.note : null;
		if(scope.note !== null) {

			var note = scope.note;

			if(note === 'OFF') {

				scope.noteOff = true;

			} else {

				scope.noteNumber = MIDIUtils.noteNameToNoteNumber(note);

			}

		} else {

			scope.noteNumber = null;
		
		}

		scope.instrument = d.instrument !== undefined ? d.instrument : null;
		scope.volume = d.volume !== undefined ? d.volume : null;

	}

	this.setData = setData;

	this.toString = function() {
		var str = '';
		
		if(scope.note !== null) {
			str += scope.note;
		} else {
			str += '...';
		}

		str += ' ';

		if(scope.instrument !== null) {
			str += StringFormat.pad(scope.instrument, 2, '0');
		} else {
			str += '..';
		}

		return str;
	};
}

module.exports = PatternCell;

},{"midiutils":1,"stringformat.js":2}],8:[function(require,module,exports){
var EventDispatcher = require('./libs/EventDispatcher');
var Pattern = require('./Pattern');

function Player() {

	'use strict';

	var that = this,
		secondsPerRow,
		secondsPerTick,
		_isPlaying = false,
		DEFAULT_BPM = 100,
		frameUpdateId = null,
		loopStart = 0;

	this.bpm = DEFAULT_BPM;
	this.linesPerBeat = 4;
	this.ticksPerLine = 12;
	this.currentRow = 0;
	this.currentOrder = 0;
	this.currentPattern = 0;
	this.repeat = true;
	this.finished = false;

	this.tracksConfig = [];
	this.tracksLastPlayedNotes = [];
	this.tracksLastPlayedInstruments = [];
	this.gear = [];
	this.patterns = [];
	this.orders = [];
	this.eventsList = [];
	this.nextEventPosition = 0;
	this.timePosition = 0;

	EventDispatcher.call(that);

	// ~~~

	function updateRowTiming() {
		secondsPerRow = 60.0 / (that.linesPerBeat * that.bpm);
		secondsPerTick = secondsPerRow / that.ticksPerLine;
	}

	function addEvent(type, params) {
		var ev = new PlayerEvent(type, params);
		that.eventsList.push(ev);
	}

	function changeToRow( value ) {
		var previousValue = that.currentRow;

		that.currentRow = value;
		that.dispatchEvent({ type: 'rowChanged', row: value, previousRow: previousValue, pattern: that.currentPattern, order: that.currentOrder });
	}

	function changeToPattern( value ) {
		var previousValue = that.currentPattern;

		that.currentPattern = value;
		that.dispatchEvent({ type: 'patternChanged', pattern: value, previousPattern: previousValue, order: that.currentOrder, row: that.currentRow });
	}

	function changeToOrder( value ) {
		var previousValue = that.currentOrder;

		that.currentOrder = value;
		that.dispatchEvent({ type: 'orderChanged', order: value, previousOrder: previousValue, pattern: that.currentPattern, row: that.currentRow });

		changeToPattern( that.orders[ value ] );
	}

	function setLastPlayedNote(note, track, column) {
		that.tracksLastPlayedNotes[track][column] = note;
	}

	function getLastPlayedNote(track, column) {
		return that.tracksLastPlayedNotes[track][column];
	}

	function setLastPlayedInstrument(note, track, column) {
		that.tracksLastPlayedInstruments[track][column] = note;
	}

	function getLastPlayedInstrument(track, column) {
		return that.tracksLastPlayedInstruments[track][column];
	}

	var frameLength = 1000 / 60; // TODO move up (?)

	function requestAuditionFrame(callback) {

		var timeout = setTimeout(callback, frameLength);
		return timeout;

	}

	function updateFrame(t /*, frameLength */) {
		
		clearTimeout(frameUpdateId);

		// var now = t !== undefined ? t : Date.now(), // TODO maybe use ctx.currTime
		var now = that.timePosition,
			frameLengthSeconds = frameLength * 0.001,
			frameEnd = now + frameLengthSeconds, // frameLength is in ms
			segmentStart = now,
			currentEvent,
			currentEventStart;

		if( that.finished && that.repeat ) {
			that.jumpToOrder( 0, 0 );
			that.finished = false;
		}

		if( that.nextEventPosition === that.eventsList.length ) {
			return;
		}

		do {

			currentEvent = that.eventsList[ that.nextEventPosition ];
			currentEventStart = loopStart + currentEvent.timestamp;

			if(currentEventStart > frameEnd) {
				break;
			}

			// Not scheduling things we left behind
			// TODO probably think about this
			// an idea: creating ghost silent nodes to play something and
			// listen to their ended event to trigger ours
			if(currentEventStart >= now) {
				var timeUntilEvent = currentEventStart - now;
				
				if(currentEvent.type === EVENT_ORDER_CHANGE) {

					changeToOrder( currentEvent.order );

				} else if( currentEvent.type === EVENT_ROW_CHANGE ) {

					changeToRow( currentEvent.row );

				} else if( currentEvent.type === EVENT_NOTE_ON ) {

					// note on -> gear -> schedule note on
					var voice = that.gear[currentEvent.instrument];
					if(voice) {
						setLastPlayedNote(currentEvent.noteNumber, currentEvent.track, currentEvent.column);
						setLastPlayedInstrument(currentEvent.instrument, currentEvent.track, currentEvent.column);
						voice.noteOn(currentEvent.noteNumber, 1.0, timeUntilEvent);
					} else {
						console.log("Attempting to call undefined voice", currentEvent.instrument);
					}

				} else if( currentEvent.type === EVENT_NOTE_OFF ) {

					var voiceIndex = getLastPlayedInstrument(currentEvent.track, currentEvent.column);
					if(voiceIndex) {
						var lastVoice = that.gear[voiceIndex];
						var lastNote = getLastPlayedNote(currentEvent.track, currentEvent.column);
						lastVoice.noteOff(lastNote, timeUntilEvent);
					}
				}
			}

			that.nextEventPosition++;

		} while ( that.nextEventPosition < that.eventsList.length );

		that.timePosition += frameLengthSeconds;

		// schedule next
		if(!that.finished) {
			frameUpdateId = requestAuditionFrame(updateFrame);
		}

	}

	// This "unpacks" the song data, which only specifies non null values
	this.loadSong = function(data) {

		that.bpm = data.bpm || DEFAULT_BPM;

		updateRowTiming();

		// Orders
		that.orders = data.orders.slice(0);

		// Tracks config
		var tracks = data.tracks.slice(0);
		that.tracksConfig = tracks;

		// Init last played notes and instruments arrays
		var tracksLastPlayedNotes = [];
		var tracksLastPlayedInstruments = [];

		tracks.forEach(function(numColumns, trackIndex) {
			var notes = [];
			var instruments = [];
			for(var i = 0; i < numColumns; i++) {
				notes.push(0);
				instruments.push(0);
			}
			tracksLastPlayedNotes[trackIndex] = notes;
			tracksLastPlayedInstruments[trackIndex] = instruments;
		});

		that.tracksLastPlayedNotes = tracksLastPlayedNotes;
		that.tracksLastPlayedInstruments = tracksLastPlayedInstruments;

		// (packed) patterns
		that.patterns = [];
		data.patterns.forEach(function(pp) {
			var pattern = new Pattern(pp.rows, tracks);

			pp.tracks.forEach(function(lines, trackIndex) {
				
				lines.forEach(function(line) {
					
					var patternTrackLine = pattern.get(line.row, trackIndex);

					line.columns.forEach(function(column, columnIndex) {

						patternTrackLine.cells[columnIndex].setData(column);
					
					});

				});

			});

			that.patterns.push(pattern);
		});

		that.patterns.forEach(function(pat, idx) {
			console.log('Pattern #', idx);
			console.log(pat.toString());
		});

	};

	this.buildEvents = function() {
		that.eventsList = [];
		that.nextEventPosition = 0;
		that.timePosition = 0;

		var numTracks = that.tracksConfig.length;
		var orderIndex = 0;
		var timestamp = 0;

		while(orderIndex < that.orders.length) {
			
			var patternIndex = that.orders[orderIndex];
			var pattern = that.patterns[patternIndex];

			addEvent( EVENT_ORDER_CHANGE, { timestamp: timestamp, order: orderIndex, pattern: patternIndex, row: 0 } );

			addEvent( EVENT_PATTERN_CHANGE, { timestamp: timestamp, order: orderIndex, pattern: patternIndex, row: 0 } );

			for( var i = 0; i < pattern.numLines; i++ ) {

				addEvent( EVENT_ROW_CHANGE, { timestamp: timestamp, row: i, order: orderIndex, pattern: patternIndex } );

				for( var j = 0; j < numTracks; j++ ) {

					var line = pattern.get(i, j);
					var cells = line.cells;

					cells.forEach(function(cell, columnIndex) {

						if(cell.noteNumber) {

							addEvent( EVENT_NOTE_ON, { timestamp: timestamp, note: cell.note, noteNumber: cell.noteNumber, instrument: cell.instrument, volume: cell.volume, order: orderIndex, pattern: patternIndex, row: i, track: j, column: columnIndex } );

						} else if(cell.noteOff) {
							
							addEvent( EVENT_NOTE_OFF, { timestamp: timestamp, instrument: cell.instrument, order: orderIndex, pattern: patternIndex, row: i, track: j, column: columnIndex } );

						}

					});

				}


				timestamp += secondsPerRow;

			}
			
			orderIndex++;
		}

		// TMP
		/*that.eventsList.forEach(function(ev, idx) {
			console.log(idx, ev.timestamp, ev.type, ev.order, ev.pattern, ev.row);
		});*/

	};

	this.play = function() {

		console.warn('TODO play');
		_isPlaying = true;

		updateFrame();
		
	};

	this.stop = function() {
		loopStart = 0;
		that.jumpToOrder(0, 0);
	};

	this.isPlaying = function() {
		return _isPlaying;
	};

	this.pause = function() {
		_isPlaying = false;
		clearTimeout(frameUpdateId);
	};

	this.jumpToOrder = function(order, row) {
		console.warn('TODO Player jumpToOrder');
	};

}

function PlayerEvent(type, properties) {

	this.type = type;

	properties = properties || {};

	for(var p in properties) {
		this[p] = properties[p];
	}

}

EVENT_ORDER_CHANGE = 'order_change';
EVENT_PATTERN_CHANGE = 'pattern_change';
EVENT_ROW_CHANGE = 'row_change';
EVENT_NOTE_ON = 'note_on';
EVENT_NOTE_OFF = 'note_off';


module.exports = Player;

},{"./Pattern":6,"./libs/EventDispatcher":10}],9:[function(require,module,exports){
var Cell = require('./PatternCell');

function TrackLine(numColumns) {

	this.cells = [];

	for(var i = 0; i < numColumns; i++) {
		var cell = new Cell();
		this.cells.push(cell);
	}

}

module.exports = TrackLine;

},{"./PatternCell":7}],10:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {

	this.addEventListener = EventDispatcher.prototype.addEventListener;
	this.hasEventListener = EventDispatcher.prototype.hasEventListener;
	this.removeEventListener = EventDispatcher.prototype.removeEventListener;
	this.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

};

EventDispatcher.prototype = {

	constructor: EventDispatcher,

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {

			listeners[ type ].splice( index, 1 );

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {

				listenerArray[ i ].call( this, event );

			}

		}

	}

};

try {
module.exports = EventDispatcher;
} catch( e ) {
	// muettttte!! *_*
}

},{}],11:[function(require,module,exports){
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
	var Mixer = require('./gear/Mixer');
	var mixer = new Mixer(audioContext);
	mixer.output.connect(audioContext.destination);
	mixer.setGlobalGain(0.25);
	
	// 0 / BASS 
	var Bajotron = require('./gear/Bajotron');
	var bass = new Bajotron(audioContext, {
		portamento: false,
		waveType: ['square', 'triangle'],
		octaves: [-2, -1] 
	});
	g.push(bass);

	// 1 / PAD
	var Colchonator = require('./gear/Colchonator');
	var pad = new Colchonator(audioContext, {
		reverbImpulse: 'data/impulseResponses/cave.ogg'
	});
	pad.setWetAmount(1.0);
	g.push(pad);
	
	// TODO drum machine

	// Plug instruments into the mixer
	g.forEach(function(instrument, index) {
		mixer.plug(index, instrument.output);
	});
	//mixer.setChannelGain(0, 0);
	//mixer.setChannelGain(1, 0.5);
	//mixer.setChannelGain(1, 0);
	
	var Oscilloscope = require('./gear/Oscilloscope');
	var oscilloscope = new Oscilloscope(audioContext);
	mixer.output.connect(oscilloscope.input);
	oscilloscope.output.connect(audioContext.destination);
	oscilloscope.domElement.id = 'oscilloscope';
	document.body.appendChild(oscilloscope.domElement);

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

},{"./Orxatron/":5,"./gear/Bajotron":13,"./gear/Colchonator":14,"./gear/Mixer":15,"./gear/Oscilloscope":18}],12:[function(require,module,exports){
function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	this.attack = attack;
	this.decay = decay;
	this.sustain = sustain;
	this.release = release;

	// ~~~
	
	this.beginAttack = function(when) {
		when = when !== undefined ? when : 0;
		//var now = audioContext.currentTime + when;
		
		var now = when;

		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		
		when = when !== undefined ? when : 0;
		var now = when;

		//var now = audioContext.currentTime + when;
		
		param.cancelScheduledValues(now);
		param.linearRampToValueAtTime(0, now + this.release);
		param.setValueAtTime(0, now + this.release + 0.001);
	};

}

module.exports = ADSR;

},{}],13:[function(require,module,exports){
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var NoiseGenerator = require('./NoiseGenerator');
var ADSR = require('./ADSR.js');

function valueOrUndefined(value, defaultValue) {
	return value !== undefined ? value : defaultValue;
}

function Bajotron(audioContext, options) {

	'use strict';

	var outputNode = audioContext.createGain();


	var i;
	var vou = valueOrUndefined; // ??? maybe too tricky ???
	
	options = options || {};

	var numVoices = options.numVoices ? options.numVoices : 2;
	var portamento = options.portamento !== undefined ? options.portamento : false;
	var octaves = options.octaves || [0, 1];
	// TODO var semitones = [ 0, 5 ] --> 5 = 1 * 12 + 5
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;

	// if wave type was a single string constant, build an array with that value
	if( Object.prototype.toString.call( waveType ) !== '[object Array]' ) {
		var waveTypes = [];
		for(i = 0; i < numVoices; i++) {
			waveTypes.push(waveType);
		}
		waveType = waveTypes;
	}

	var voices = [];
	for(i = 0; i < numVoices; i++) {
		
		var voice = new OscillatorVoice(audioContext, {
			portamento: portamento,
			waveType: waveType[i]
		});

		voice.output.connect(outputNode);
		voices.push(voice);
	}
	
	
	var adsrParams = options.adsr || {};
	var adsr = new ADSR(audioContext, outputNode.gain, vou(adsrParams.attack, 0.0), vou(adsrParams.decay, 0.2), vou(adsrParams.sustain, 0.05), vou(adsrParams.release, 0.10));


	// TODO an idea for modulating the output using gain + noise:
	// extra gain node before outputNode ( < Gain)
	// mode: + or - : automate gain with noise output
	//     -> i.e. connect noise output to extraGain.gain
	// mode: * or /: maybe some sort of delay node...?
	//     -> bass output * noise = ???
	var noiseOptions = options.noise;
	if(noiseOptions && noiseOptions.length === undefined) {
		noiseOptions.length = audioContext.sampleRate;
	}
	var noiseGenerator = new NoiseGenerator(audioContext, noiseOptions);

	if(noiseOptions) {
		noiseGenerator.output.connect(outputNode);
	}


	// ~~~


	this.output = outputNode;


	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;

		adsr.beginAttack(audioWhen);

		noiseGenerator.noteOn(note, volume, audioWhen);

		voices.forEach(function(voice, index) {
			var frequency = MIDIUtils.noteNumberToFrequency( note + octaves[index] * 12 );
			voice.noteOn(frequency, audioWhen);
		});

	};


	this.noteOff = function(noteNumber, when) {

		// Because this is a monophonic instrument, `noteNumber` is quietly ignored
		when = when !== undefined ? when : 0;

		adsr.beginRelease(when);

		var releaseEndTime = when + adsr.release;

		voices.forEach(function(voice) {
			voice.noteOff(releaseEndTime);
		});

		noiseGenerator.noteOff(releaseEndTime);

	};
}

module.exports = Bajotron;

},{"./ADSR.js":12,"./NoiseGenerator":16,"./OscillatorVoice":17,"midiutils":1}],14:[function(require,module,exports){
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');
var Reverbetron = require('./Reverbetron');

function Colchonator(audioContext, options) {
	
	// TODO should we have a global ADSR or go on with the per voice ADSR

	options = options || {};

	var numVoices = options.numVoices || 3;
	var reverbImpulse = options.reverbImpulse;

	var voices = [];
	var outputNode = audioContext.createGain();
	var voicesNode = audioContext.createGain();
	var dryOutputNode = audioContext.createGain();
	var wetOutputNode = audioContext.createGain();
	var reverbNode = new Reverbetron(audioContext);

	if(reverbImpulse) {
		reverbNode.loadImpulse(reverbImpulse);
	}
	reverbNode.output.connect(wetOutputNode);

	voicesNode.connect(dryOutputNode);
	voicesNode.connect(reverbNode.input);

	dryOutputNode.connect(outputNode);
	wetOutputNode.connect(outputNode);




	setWetAmount(0.5);

	initVoices(numVoices);
	

	//

	function initVoices(number) {
		
		var v;

		if(number < voices.length) {

			console.log('Colchonator - reducing polyphony', voices.length, '=>', number);

			while(number < voices.length) {
				v = voices.pop();
				v.voice.noteOff();
				v.voice.output.disconnect();
			}

		} else if(number > voices.length) {

			console.log('Colchonator - increasing polyphony', voices.length, '=>', number);

			while(number > voices.length) {
				v = {
					timestamp: 0,
					note: 0,
					voice: new Bajotron(audioContext, {
						// this one is pretty crazy!
						// numVoices: 3,
						// octaves: [ -1, 0, 1 ],
						numVoices: 1,
						adsr: {
							attack: 0.1,
							sustain: 0.7,
							release: 0.5
						},
						noise: {
							type: 'white'
						}
					})
				};

				v.voice.output.connect(voicesNode);
				
				voices.push(v);
			}

		}

	}



	function getFreeVoice(noteNumber) {

		var freeVoice;

		// criteria is to return the oldest one
		
		// oldest = the first one,
		// extract it, stop it,
		// and use it just as if it was new
		var oldest = voices.shift();

		oldest.voice.noteOff();
		oldest.note = noteNumber;
		oldest.timestamp = Date.now();

		voices.push(oldest);

		return oldest.voice;

	}


	function getVoiceIndexByNote(noteNumber) {

		for(var i = 0; i < voices.length; i++) {
			var v = voices[i];
			if(v.note === noteNumber) {
				return i;
			}
		}

	}


	function getVoiceByNote(noteNumber) {
		var index = getVoiceIndexByNote(noteNumber);
		if(index !== -1) {
			return voices[index].voice;
		}
	}


	function setWetAmount(v) {
		// 0 = totally dry
		var dryAmount = 1.0 - v;
		dryOutputNode.gain.value = dryAmount;
		wetOutputNode.gain.value = v;
	}


	// ~~~

	this.output = outputNode;


	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var voice;

		console.log('Colchonator noteOn', note, MIDIUtils.noteNumberToName(note));

		voice = getFreeVoice(note);

		voice.noteOn(note, volume, when);

	};


	this.noteOff = function(noteNumber, when) {
		
		console.log('Colchonator NOTE OFF', noteNumber);

		var voice = getVoiceByNote(noteNumber);

		console.log('voice = ', voice);

		if(voice) {
			voice.noteOff(when);
		}

		// if number of active voices = 1 -> noise note off

	};


	this.setWetAmount = function(v) {
		setWetAmount(v);
	};

}

module.exports = Colchonator;

},{"./ADSR.js":12,"./Bajotron":13,"./OscillatorVoice":17,"./Reverbetron":19,"midiutils":1}],15:[function(require,module,exports){
// A simple mixer for avoiding early deafness
function Mixer(audioContext) {

	var output = audioContext.createGain();
	var channels = [];
	var numChannels = 16;

	initChannels();

	function initChannels() {
		while(channels.length < numChannels) {
			var fader = new Fader(audioContext);
			fader.output.connect(output);
			fader.setGain(0.7);
			channels.push(fader);
		}
	}

	// ~~~
	
	this.output = output;

	this.plug = function(channelNumber, audioOutput) {

		if(channelNumber > channels.length) {
			console.error('Mixer: trying to plug into a channel that does not exist', channelNumber);
			return;
		}

		var faderInput = channels[channelNumber].input;
		audioOutput.connect(faderInput);
	};

	this.setGlobalGain = function(value) {
		output.gain.value = value;
	};

	this.setChannelGain = function(channelNumber, value) {
		channels[channelNumber].setGain(value);
	};
}


function Fader(audioContext, options) {
	
	var gain = audioContext.createGain();

	// ~~~
	
	this.input = gain;
	this.output = gain;

	this.setGain = function(value) {
		gain.gain.value = value;
	};

}

module.exports = Mixer;

},{}],16:[function(require,module,exports){
var SampleVoice = require('./SampleVoice');

function generateWhiteNoise(size) {

	var out = [];
	for(var i = 0; i < size; i++) {
		out.push(Math.random() * 2 - 1);
	}
	return out;

}

// Pink and brown noise generation algorithms adapted from
// https://github.com/zacharydenton/noise.js/blob/master/noise.js

function generatePinkNoise(size) {

	var out = generateWhiteNoise(size);
	var b0, b1, b2, b3, b4, b5, b6;
	
	b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

	for (var i = 0; i < size; i++) {

		var white = out[i];

		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.96900 * b2 + white * 0.1538520;
		b3 = 0.86650 * b3 + white * 0.3104856;
		b4 = 0.55000 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.0168980;
		out[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
		out[i] *= 0.11; // (roughly) compensate for gain
		b6 = white * 0.115926;

	}

	return out;
}

function generateBrownNoise(size) {

	var out = generateWhiteNoise(size);
	var lastOutput = 0.0;

	for(var i = 0; i < size; i++) {

		var white = out[i];
		out[i] = (lastOutput + (0.02 * white)) / 1.02;
		lastOutput = out[i];
		out[i] *= 3.5; // (roughly) compensate for gain
		
	}

	return out;

}

function NoiseGenerator(audioContext, options) {
	
	options = options || {};
	
	var type = options.type || 'white';
	var length = options.length || 4096;

	var output = audioContext.createGain();
	var sourceVoice;

	buildBuffer(length, type);

	// 
	
	function buildBuffer(length, type) {

		var noiseFunction, bufferData;

		switch(type) {
			
			case 'pink': noiseFunction = generatePinkNoise;
					break;

			case 'brown': noiseFunction = generateBrownNoise;
					break;

			default:
			case 'white': noiseFunction = generateWhiteNoise;
					break;
		}

		bufferData = noiseFunction(length);

		var buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
		console.log('NoiseGenerator buffer length', length);
		var channelData = buffer.getChannelData(0);
		bufferData.forEach(function(v, i) {
			channelData[i] = v;
		});
		
		sourceVoice = new SampleVoice(audioContext, {
			loop: true,
			buffer: buffer
		});

		sourceVoice.output.connect(output);

	}

	// ~~~
	
	this.output = output;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		sourceVoice.noteOn(note, volume, when);

	};

	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;
		sourceVoice.noteOff(when);

	};

}

module.exports = NoiseGenerator;

},{"./SampleVoice":20}],17:[function(require,module,exports){
function OscillatorVoice(context, options) {

	var internalOscillator = null;
	var gain = context.createGain();

	options = options || {};

	var portamento = options.portamento !== undefined ? options.portamento : true;
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;

	this.output = gain;

	this.noteOn = function(frequency, when) {

		if(!portamento) {
			this.noteOff();
		}

		// The oscillator node is recreated here "on demand",
		// and all the parameters are set too.
		if(internalOscillator === null) {
			internalOscillator = context.createOscillator();
			internalOscillator.type = waveType;
			internalOscillator.connect(gain);
		}
		
		internalOscillator.frequency.value = frequency;
		
		console.log('oscillator voice note on', when);
		internalOscillator.start(when);

	};

	this.noteOff = function(when) {

		if(internalOscillator === null) {
			return;
		}
		internalOscillator.stop(when);
		internalOscillator = null;

	};
}

OscillatorVoice.WAVE_TYPE_SINE = 'sine';
OscillatorVoice.WAVE_TYPE_SQUARE = 'square';
OscillatorVoice.WAVE_TYPE_SAWTOOTH = 'sawtooth';
OscillatorVoice.WAVE_TYPE_TRIANGLE = 'triangle';

module.exports = OscillatorVoice;

},{}],18:[function(require,module,exports){
function Oscilloscope(audioContext, options) {
	
	'use strict';

	var canvasWidth = 200;
	var canvasHeight = 100;
	var canvasHalfWidth = canvasWidth * 0.5;
	var canvasHalfHeight = canvasHeight * 0.5;
	var numSlices = 32;
	var inverseNumSlices = 1.0 / numSlices;

	// Graphics
	var container = document.createElement('div');
	var canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var ctx = canvas.getContext('2d');

	container.appendChild(canvas);

	// and audio
	var processor = audioContext.createScriptProcessor(2048);
	var bufferLength = processor.bufferSize;

	console.log('buffer length oscilloscope', bufferLength);
	console.log('tutu', canvas, container);

	processor.onaudioprocess = updateDisplay;

	//
	
	function updateDisplay(evt) {
		
		var buffer = evt.inputBuffer,
			bufferLeft = buffer.getChannelData(0),
			bufferRight = buffer.getChannelData(1),
			numSamples = bufferLeft.length,
			sliceWidth = canvasWidth / numSlices;

		var sliceSize = Math.round(numSamples * inverseNumSlices),
			index = 0;

			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgb(0, 255, 0)';

			ctx.beginPath();

			var x = 0;

			for(var i = 0; i < numSlices; i++) {
				index += sliceSize ;

				if(index > numSamples) {
					break;
				}

				var v = (bufferLeft[index] + bufferRight[index]) * 0.5,
					y = canvasHalfHeight + v * canvasHalfHeight; // relative to canvas size. Originally it's -1..1

				if(i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			ctx.lineTo(canvasWidth, canvasHalfHeight);

			ctx.stroke();

	}

	// ~~~
	
	this.input = processor;
	this.output = processor;
	this.domElement = container;

}

module.exports = Oscilloscope;

},{}],19:[function(require,module,exports){
function Reverbetron(audioContext) {

	var that = this;
	var convolver = audioContext.createConvolver();


	// ~~~
	
	this.input = convolver;
	this.output = convolver;

	this.setImpulse = function(buffer) {
		convolver.buffer = buffer;
	};

	this.loadImpulse = function(path) {
		console.log('Reverbetron load impulse', path);

		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {

			audioContext.decodeAudioData(request.response, function(buffer) {
					that.setImpulse(buffer);
				},
				function() {
					// onError
				}
			);
		};
		
		request.send();
		
	};
}

module.exports = Reverbetron;

},{}],20:[function(require,module,exports){
// This voice plays a buffer / sample, and it's capable of regenerating the buffer source once noteOff has been called
// TODO set a base note and use it + noteOn note to play relatively pitched notes

function SampleVoice(audioContext, options) {

	var that = this;

	options = options || {};

	var loop = options.loop !== undefined  ? options.loop : true;
	var buffer = options.buffer || audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
	var bufferSource = null;
	var output = audioContext.createGain();

	// ~~~
	
	this.output = output;
	
	this.noteOn = function(frequency, volume, when) {

		// The oscillator node is recreated here "on demand",
		// and all the parameters are set too.
		if(bufferSource === null) {
			bufferSource = audioContext.createBufferSource();
			bufferSource.loop = loop;
			bufferSource.buffer = buffer;
			bufferSource.connect(output);
		}
		
		//var now = when + audioContext.currentTime;
		var now = when;
		console.log('samplevoice start', now);
		bufferSource.start(now);

		// Auto note off if not looping, though it can be a little bit inaccurate
		// (due to setTimeout...)
		if(!loop) {
			setTimeout(function() {
				that.noteOff();
			}, when * 1000);
		}

	};


	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;

		if(bufferSource === null) {
			return;
		}

		bufferSource.stop(when /* + audioContext.currentTime*/);
		bufferSource = null;

	};

	
}

module.exports = SampleVoice;

},{}],21:[function(require,module,exports){
window.addEventListener('DOMComponentsLoaded', function() {

	var app = require('./app');
	app.start();

}, false);

},{"./app":11}]},{},[21])
;