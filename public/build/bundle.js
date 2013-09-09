;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = function() {
	var socket;
	var listeners = [];

	function onMessage(data) {

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

					// console.log('MATCH', address, listener.regexp, match, 'expected', listener.expectedValue, 'actual value', value);
					listener.callback(match, value);

					break;

				}

			}
		}

		
	}



	this.connect = function(address) {

		socket = io.connect(address);

		// whenever we receive an 'osc' message from the back-end, process it with onMessage
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


	this.send = function(address, value) {

		socket.emit('message', [address, value]);

	};

	
};

},{}],8:[function(require,module,exports){
module.exports = {
	DataUtils: require('./DataUtils'),
	Player: require('./Player'),
	OSC: require('./OSC'),
	Rack: require('./Rack')
};

},{"./DataUtils":6,"./OSC":7,"./Player":11,"./Rack":12}],9:[function(require,module,exports){
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

},{"./TrackLine":13,"stringformat.js":5}],10:[function(require,module,exports){
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
		scope.volume = d.volume !== undefined ? d.volume * 1.0 / 0x80 : null;

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

},{"midiutils":4,"stringformat.js":5}],11:[function(require,module,exports){
// TODO many things don't need to be 'public' as for example eventsList
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
		that.dispatchEvent({ type: EVENT_ROW_CHANGE, row: value, previousRow: previousValue, pattern: that.currentPattern, order: that.currentOrder });
	}


	function changeToPattern( value ) {
		var previousValue = that.currentPattern;

		that.currentPattern = value;
		that.dispatchEvent({ type: EVENT_PATTERN_CHANGE, pattern: value, previousPattern: previousValue, order: that.currentOrder, row: that.currentRow });
	}


	function changeToOrder( value ) {
		var previousValue = that.currentOrder;

		that.currentOrder = value;
		that.dispatchEvent({ type: EVENT_ORDER_CHANGE, order: value, previousOrder: previousValue, pattern: that.currentPattern, row: that.currentRow });

		changeToPattern( that.orders[ value ] );
	}


	function updateNextEventToOrderRow(order, row) {

		var p = 0;

		for(var i = 0; i < that.eventsList.length; i++) {
			
			var ev = that.eventsList[i];
			p = i;

			if(EVENT_ROW_CHANGE === ev.type && ev.row === row && ev.order === order ) {
				break;
			}
		}
		
		that.nextEventPosition = p;

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


	var frameLength = 1000 / 60.0; // TODO move up (?)

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
						voice.noteOn(currentEvent.noteNumber, currentEvent.volume, timeUntilEvent);
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

		/*that.patterns.forEach(function(pat, idx) {
			console.log('Pattern #', idx);
			console.log(pat.toString());
		});*/

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

		// TODO if the new pattern to play has less rows than the current one,
		// make sure we don't play out of index
		changeToOrder( order );

		if( row === undefined ) {
			row = this.currentRow;
		}

		changeToRow( row );

		updateNextEventToOrderRow( order, row );
		
		this.timePosition = this.eventsList[ this.nextEventPosition ].timestamp + loopStart;
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

},{"./Pattern":9,"./libs/EventDispatcher":14}],12:[function(require,module,exports){
// very simple 'rack' to represent a uhm... rack of 'machines'
function Rack() {
	var machines = [];
	var currentlySelectedIndex = -1;
	var currentMachine = null;

	Object.defineProperties(this, {
		selected: {
			get: function() {
				return currentMachine;
			}
		}
	});

	function updateCurrent() {
		currentMachine = machines[currentlySelectedIndex];
	}


	this.add = function(machine) {

		if(machines.indexOf(machine) === -1) {
			machines.push(machine);
		}

		if(currentlySelectedIndex === -1) {
			currentlySelectedIndex = 0;
		}

		updateCurrent();
	
	};


	this.selectNext = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = ++currentlySelectedIndex % machines.length;

		updateCurrent();

	};


	this.selectPrevious = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = --currentlySelectedIndex < 0 ? machines.length - 1 : currentlySelectedIndex;

		updateCurrent();

	};

}

module.exports = Rack;

},{}],13:[function(require,module,exports){
var Cell = require('./PatternCell');

function TrackLine(numColumns) {

	this.cells = [];

	for(var i = 0; i < numColumns; i++) {
		var cell = new Cell();
		this.cells.push(cell);
	}

}

module.exports = TrackLine;

},{"./PatternCell":10}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
var audioContext,
	renderer,
	deck,
	guiContainer;

var Orxatron = require('./Orxatron/'),
	Quneo = require('./quneo.js'),
	gearGUI = require('./gear/gui/GUI'),
	gear,
	rack;

function start() {

	var rendererContainer = document.getElementById('rendererContainer');

	gearGUI.init();

	deck = document.querySelector('x-deck');
	guiContainer = document.getElementById('gui');
	console.log('gui container', guiContainer);

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

	resetQuneo();

}


function initialiseGear(audioContext) {
	
	var g = [];
	
	rack = new Orxatron.Rack();

	// Audio gear
	// ----------
	var Mixer = require('./gear/Mixer');
	var mixer = new Mixer(audioContext);
	mixer.output.connect(audioContext.destination);
	mixer.gain = 0.25;
	
	// 0 / BASS 
	var Bajotron = require('./gear/Bajotron');
	var bass = new Bajotron(audioContext, {
		portamento: false,
		waveType: ['square', 'triangle'],
		octaves: [3, 4] 
	});
	g.push(bass);

	// 1 / PAD
	var Colchonator = require('./gear/Colchonator');
	var pad = new Colchonator(audioContext);
	//pad.reverb.wetAmount = 1.0;
	pad.reverb.loadImpulse('data/impulseResponses/cave.ogg');
	g.push(pad);
	
	// 2 / DRUM MACHINE
	var Porrompom = require('./gear/Porrompom');
	var p808 = 'data/samples/808/';
	var dm808 = new Porrompom(audioContext, {
		mappings: {
			'C-4': p808 + 'bassdrum.wav',
			'C#4': p808 + 'snaredrum.wav',
			'D-4': p808 + 'clap.wav',
			'D#4': p808 + 'claves.wav',
			'E-4': p808 + 'cowbell.wav',
			'F-4': p808 + 'hihat_closed.wav',
			'F#4': p808 + 'hihat_open.wav',
			'G-4': p808 + 'maracas.wav',
			'G#4': p808 + 'rimshot.wav',
			'A-4': p808 + 'tom_low.wav'
		}
	});
	g.push(dm808);

	// Plug instruments into the mixer
	g.forEach(function(instrument, index) {
		console.log('plug', instrument, index);
		mixer.plug(index, instrument.output);
	});
	mixer.setFaderGain(0, 0.1);
	//mixer.setFaderGain(1, 0.0);
	
	var Oscilloscope = require('./gear/Oscilloscope');
	var oscilloscope = new Oscilloscope(audioContext);
	mixer.output.connect(oscilloscope.input);
	oscilloscope.domElement.id = 'oscilloscope';
	document.body.appendChild(oscilloscope.domElement);

	// GFX gear
	// --------
	// TODO gfx gear!

	// Gear GUI
	// --------
	var mixerGUI = document.createElement(mixer.guiTag);
	mixerGUI.attachTo(mixer);
	guiContainer.appendChild(mixerGUI);

	// TODO tmp, should append them all consecutively
	var bassGUI = document.createElement(bass.guiTag);
	bassGUI.attachTo(bass);
	guiContainer.appendChild(bassGUI);


	var padGUI = document.createElement(pad.guiTag);
	padGUI.attachTo(pad);
	var impulsePath = 'data/impulseResponses/';
	padGUI.reverb.impulsePaths = [
		impulsePath + 'cave.ogg',
		impulsePath + 'medium-room1.ogg'
	];
	guiContainer.appendChild(padGUI);

	rack.add(bass);
	rack.add(pad);
	rack.add(dm808);

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
	var activePads = [];
	for(var k = 0; k < 16; k++) {
		activePads.push(false);
	}

	osc.on(prefix + 'pads\/(\\d+)\/drum\/pressure', null, function(match, value) {
		
		var selected = rack.selected;
		var pressure = value;

		if(selected) {
			var padIndex = match[1] * 1;
			var note = 44 + padIndex;
			var activeAlready = activePads[padIndex];

			if(activeAlready) {

				// arbitrary 'low' threshold
				if(pressure <= 3) {
					// release
					console.log('release' , note);
					selected.noteOff(note);
					activePads[padIndex] = false;
				} else {
					// Do nothing! Else we'll retrig the same note
					// TODO we could modulate the volume of current note
				}

			} else {
				// Another arbitrary threshold to prevent happy retrigging
				if(pressure > 16) {
					console.log('note on', note);
					selected.noteOn(note);
					activePads[padIndex] = true;
				}
			}
		}
	});

	// TODO: "mixer" -> sample cue points (granular...)
	// TODO: up/down (left/right) to select which sample to play, and trigger it
	

	// osc.input -> player
	// -------------------
	// PLAY -> player.play
	osc.on(prefix + 'transport\/2\/note_velocity', 127, play);
	// STOP -> player.pause
	osc.on(prefix + 'transport\/1\/note_velocity', 127, pause);

	// up/down -> move focus to prev/next instrument in rack
	osc.on(prefix + 'upButton\/0\/note_velocity', 0, focusPrevInstrument);
	osc.on(prefix + 'downButton\/0\/note_velocity', 0, focusNextInstrument);

	// player -> osc.output
	// --------------------
	
	// TODO: flash play button to the beat
	// TODO: flash stop button at 0.5
	
	// Use pad columns/grid as pattern/line indicator
	// Turn columns on/off as the song is played
	var lastColumn = null;
	var lastRow = null;
	player.addEventListener('row_change', function(ev) {
		
		var columnNumber = ev.row % 8;
		var columnLeds = Quneo.getColumnLeds(columnNumber);
		var rowNumber = ((63 - ev.row) / 16) | 0;
		var rowPads = Quneo.getRowPads(rowNumber);

		if(lastColumn !== null) {
			// Turn older off
			var prevLeds = Quneo.getColumnLeds(lastColumn);
			prevLeds.forEach(function(index) {
				osc.send(Quneo.getLedPath(index, 'red'), 0);
				osc.send(Quneo.getLedPath(index, 'green'), 0);
			});
		}

		if(lastRow !== null && lastRow != rowNumber) {
			// same
			var prevPads = Quneo.getRowPads(lastRow);
			prevPads.forEach(function(index) {
				osc.send(Quneo.getPadLedsPath(index, 'red'), 0);
				osc.send(Quneo.getPadLedsPath(index, 'green'), 0);
			});
		}

		rowPads.forEach(function(index) {
			var v = 0.15;
			osc.send(Quneo.getPadLedsPath(index, 'green'), v);
			osc.send(Quneo.getPadLedsPath(index, 'red'), v);
		});

		columnLeds.forEach(function(index) {
			var path = Quneo.getLedPath(index, 'red');
			osc.send(path, 0.5);
		});

		
		lastColumn = columnNumber;
		lastRow = rowNumber;

	}, false);

	

	// TODO: vumeters?

}

function resetQuneo() {

	// Turn play button ON to show we're ready
	osc.send(Quneo.getPlayLedPath(), 1.0);

	// Initially turn off all the pads just in case something remained
	for(var i = 0; i < 16; i++) {
		osc.send(Quneo.getPadLedsPath(i, 'green'), 0);
		osc.send(Quneo.getPadLedsPath(i, 'red'), 0);
	}
}


function setupDeck(player, deck) {
	// player -> deck

	player.addEventListener('order_change', function(ev) {
		// 'reduce' to showing 1 slide every 4 orders
		var slideIndex = (ev.order / 4) | 0;
		var activeCard = deck.getSelectedCard();
		var activeCardIndex = deck.getCardIndex(activeCard);

		if(activeCardIndex !== slideIndex) {
			console.log('deck ⇒ shuffle to', slideIndex);
			deck.shuffleTo(slideIndex);
		}
	}, false);
}


function setupKeyboardAndTransport() {
	// Just in case OSC is not available!
	$('#play').on('click', play);
	$('#pause').on('click', pause);
	$('#rew').on('click', function() {
		playerJumpTo(-1);
	});
	$('#fwd').on('click', function() {
		playerJumpTo(1);
	});
}

var playAnimation = null;

function play() {
	if(!player.isPlaying()) {
		player.play();

		clearInterval(playAnimation);
		playAnimation = setInterval(updatePlayButton, 20);
		osc.send(Quneo.getStopLedPath(), 0.5);
	}
}


function updatePlayButton() {
	var t = Date.now() * 0.01;
	var v = (2 + Math.sin(t)) * 0.25;
	osc.send(Quneo.getPlayLedPath(), v);
}


function pause() {
	player.pause();
	clearInterval(playAnimation);
	osc.send(Quneo.getPlayLedPath(), 0);
}


function playerJumpTo(offset) {
	
	var newOrder = player.currentOrder + offset;
	var numOrders = player.orders.length;

	if(newOrder > numOrders) {
		newOrder = 0;
	} else if(newOrder < 0) {
		newOrder = numOrders - 1;
	}

	player.jumpToOrder(newOrder, 0);

}


function focusPrevInstrument() {
	rack.selectPrevious();
}


function focusNextInstrument() {
	rack.selectNext();
}


module.exports = {
	start: start
};

},{"./Orxatron/":8,"./gear/Bajotron":18,"./gear/Colchonator":20,"./gear/Mixer":21,"./gear/Oscilloscope":24,"./gear/Porrompom":25,"./gear/gui/GUI":32,"./quneo.js":39}],16:[function(require,module,exports){
var EventDispatcher = require('EventDispatcher');

function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	var that = this;
	var values = {};

	EventDispatcher.call(this);

	setParams({
		attack: attack,
		decay: decay,
		sustain: sustain,
		release: release
	});

	['attack', 'decay', 'sustain', 'release'].forEach(function(param) {
		Object.defineProperty(that, param, {
			get: makeGetter(param),
			set: makeSetter(param)
		});
	});

	//

	function makeGetter(param) {
		return function() {
			return values[param];
		};
	}

	function makeSetter(obj, param) {
		var paramChanged = param + '_changed';
		return function(v) {
			values[param] = v;
			that.dispatchEvent({ type: paramChanged, value: v });
		};
	}

	function setParams(params) {
		values.attack = params.attack !== undefined ? params.attack : 0.0;
		values.decay = params.decay !== undefined ? params.decay : 0.02;
		values.sustain = params.sustain !== undefined ? params.sustain : 0.5;
		values.release = params.release !== undefined ? params.release : 0.10;
	}
	
	// ~~~
	
	this.setParams = setParams;

	this.beginAttack = function(when) {
		when = when !== undefined ? when : 0;
		
		var now = when;

		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		
		when = when !== undefined ? when : 0;
		var now = when;

		param.cancelScheduledValues(now);
		param.linearRampToValueAtTime(0, now + this.release);
		param.setValueAtTime(0, now + this.release + 0.001);
	};

}

module.exports = ADSR;

},{"EventDispatcher":1}],17:[function(require,module,exports){
var EventDispatcher = require('EventDispatcher');

function ArithmeticMixer(audioContext) {
	
	var that = this;

	// input A -> channel 0
	// input B -> channel 1
	// output -> script processor
	// mix function
	var processor = audioContext.createScriptProcessor(2048, 2, 1);
	var mixFunction = multiply;

	EventDispatcher.call(this);

	processor.onaudioprocess = onProcessing;

	Object.defineProperties(this, {
		'mixFunction': {
			'set': function(v) {
				switch(v) {
					case 'divide': mixFunction = divide; break;
					case 'multiply': mixFunction = multiply; break;
					default:
					case 'sum': mixFunction = sum; break;
				}
				that.dispatchEvent({ type: 'mix_function_changed', value: v });
			},
			'get': function() {
				if(mixFunction === divide) {
					return 'divide';
				} else if(mixFunction === multiply) {
					return 'multiply';
				} else {
					return 'sum';
				}
			}
		}
	});

	//
	
	function onProcessing(ev) {
		var inputBuffer = ev.inputBuffer,
			bufferA = inputBuffer.getChannelData(0),
			bufferB = inputBuffer.getChannelData(1),
			outputBuffer = ev.outputBuffer.getChannelData(0),
			numSamples = bufferA.length;

		for(var i = 0; i < numSamples; i++) {
			outputBuffer[i] = mixFunction(bufferA[i], bufferB[i]);
		}

	}

	function sum(a, b) {
		return a + b;
	}

	function multiply(a, b) {
		return (a+0.0) * (b+0.0);
	}

	// Doesn't work quite right yet
	function divide(a, b) {
		a = a + 0.0;
		b = b + 0.0;
		if(Math.abs(b) < 0.00001) {
			b = 0.0001;
		}	
		return a / b;
	}


	// ~~~
	
	this.input = processor;
	this.output = processor;
}

module.exports = ArithmeticMixer;

},{"EventDispatcher":1}],18:[function(require,module,exports){
var EventDispatcher = require('EventDispatcher');
var OscillatorVoice = require('./OscillatorVoice');
var NoiseGenerator = require('./NoiseGenerator');
var ArithmeticMixer = require('./ArithmeticMixer');
var ADSR = require('./ADSR.js');

function valueOrUndefined(value, defaultValue) {
	return value !== undefined ? value : defaultValue;
}

function Bajotron(audioContext, options) {

	'use strict';

	var that = this;
	var defaultWaveType = OscillatorVoice.WAVE_TYPE_SQUARE;
	var defaultOctave = 4;
	var portamento;
	var voices = [];
	// TODO var semitones = [];

	var outputNode = audioContext.createGain();
	var arithmeticMixer = new ArithmeticMixer(audioContext);

	arithmeticMixer.output.connect(outputNode);

	var voicesOutputNode = audioContext.createGain();
	var noiseOutputNode = audioContext.createGain();

	voicesOutputNode.connect(arithmeticMixer.input);
	noiseOutputNode.connect(arithmeticMixer.input);

	var adsr = new ADSR(audioContext, outputNode.gain);
	
	var noiseAmount = 0.0;
	var noiseGenerator = new NoiseGenerator(audioContext);

	EventDispatcher.call(this);

	parseOptions(options);

	
	Object.defineProperties(this, {
		portamento: {
			get: function() { return portamento; },
			set: setPortamento
		},
		numVoices: {
			get: function() { return voices.length; },
			set: setNumVoices
		},
		voices: {
			get: function() { return voices; }
		},
		adsr: {
			get: function() { return adsr; }
		},
		noiseAmount: {
			get: function() { return noiseAmount; },
			set: setNoiseAmount
		},
		noiseGenerator: {
			get: function() { return noiseGenerator; }
		},
		arithmeticMixer: {
			get: function() { return arithmeticMixer; }
		}
	});

	//
	
	function parseOptions(options) {

		options = options || {};

		setPortamento(options.portamento !== undefined ? options.portamento : false);
		setNumVoices(options.numVoices ? options.numVoices : 2);
		
		if(options.waveType) {
			setVoicesWaveType(options.waveType);
		}

		if(options.octaves) {
			setVoicesOctaves(options.octaves);
		}

		if(options.adsr) {
			adsr.setParams(options.adsr);
		}

		setNoiseAmount(options.noiseAmount !== undefined ? options.noiseAmount : 0.0);
		if(options.noise) {
			for(var k in options.noise) {
				console.log('set noise opt', k, options.noise[k]);
				noiseGenerator.k = options.noise[k];
			}
		}

	}
	

	function setPortamento(v) {

		portamento = v;
		voices.forEach(function(voice) {
			voice.portamento = v;
		});
		that.dispatchEvent({ type: 'portamento_changed', portamento: v });
	
	}


	function setNumVoices(v) {

		var voice;
		
		if(v > voices.length) {
			// add voices
			while(v > voices.length) {
				voice = new OscillatorVoice(audioContext, {
					portamento: portamento,
					waveType: defaultWaveType,
					octave: defaultOctave
				});
				voice.output.connect(voicesOutputNode);
				voices.push(voice);
			}
		} else {
			// remove voices
			while(v < voices.length) {
				voice = voices.pop();
				voice.output.disconnect();
			}
		}

		that.dispatchEvent({ type: 'num_voices_changed', num_voices: v });

	}


	function setVoicesWaveType(v) {
	
		voices.forEach(function(voice, index) {
			if( Object.prototype.toString.call( v ) === '[object Array]' ) {
				voice.waveType = v[index];
			} else {
				voice.waveType = v;
			}
		});

	}


	function setVoicesOctaves(v) {

		for(var i = 0; i < voices.length; i++) {
			if(v[i] !== undefined) {
				voices[i].octave = v[i];
			}
		}

	}


	function setNoiseAmount(v) {
		
		noiseAmount = Math.min(1.0, v * 1.0);

		if(noiseAmount <= 0) {
			noiseGenerator.output.disconnect();
		} else {
			noiseGenerator.output.connect(noiseOutputNode);
		}

		noiseOutputNode.gain.value = noiseAmount;
		voicesOutputNode.gain.value = 1.0 - noiseAmount;

		that.dispatchEvent({ type: 'noise_amount_changed', amount: noiseAmount });

	}


	// ~~~

	this.guiTag = 'gear-bajotron';

	this.output = outputNode;


	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined && volume !== null ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;

		adsr.beginAttack(audioWhen);

		noiseGenerator.noteOn(note, volume, audioWhen);

		voices.forEach(function(voice, index) {
			voice.noteOn(note, volume, audioWhen);
		});

	};


	this.noteOff = function(noteNumber, when) {

		// Because this is a monophonic instrument, `noteNumber` is quietly ignored
		when = when !== undefined ? when : 0;
		var audioWhen = when + audioContext.currentTime;

		adsr.beginRelease(audioWhen);

		var releaseEndTime = audioWhen + adsr.release;

		voices.forEach(function(voice) {
			voice.noteOff(releaseEndTime);
		});

		noiseGenerator.noteOff(releaseEndTime);

	};
}

module.exports = Bajotron;

},{"./ADSR.js":16,"./ArithmeticMixer":17,"./NoiseGenerator":22,"./OscillatorVoice":23,"EventDispatcher":1}],19:[function(require,module,exports){
function BufferLoader(audioContext) {

	this.load = function(path, loadedCallback, errorCallback) {
	
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {

			// loadedCallback gets the decoded buffer as parameter
			// errorCallback gets nothing as parameter
			audioContext.decodeAudioData(request.response, loadedCallback, errorCallback);

		};

		request.send();

	};

}

module.exports = BufferLoader;

},{}],20:[function(require,module,exports){
var EventDispatcher = require('EventDispatcher');
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');
var Reverbetron = require('./Reverbetron');
var NoiseGenerator = require('./NoiseGenerator');

function Colchonator(audioContext, options) {
	
	options = options || {};

	var numVoices = options.numVoices || 3;

	var voices = [];
	var outputNode = audioContext.createGain();
	var voicesNode = audioContext.createGain();
	var reverbNode = new Reverbetron(audioContext, options.reverb);

	// This dummy node is not connected anywhere-we'll just use it to
	// set up identical properties in each of our internal Bajotron instances
	var dummyBajotron = new Bajotron(audioContext);

	// bajotron events and propagating them...
	dummyBajotron.addEventListener('portamento_changed', setVoicesPortamento);
	dummyBajotron.addEventListener('num_voices_changed', setVoicesNumVoices);

	// voiceSettings - octaves and shapes
	// TODO not sure how to do that :-(
	
	for(var prop in dummyBajotron.adsr) {
		if(dummyBajotron.adsr.hasOwnProperty(prop)) {
			dummyBajotron.adsr.addEventListener(prop + '_changed', makeADSRListener(dummyBajotron.adsr, prop));
		}
	}

	dummyBajotron.noiseGenerator.addEventListener('type_changed', setVoicesNoiseType);
	dummyBajotron.noiseGenerator.addEventListener('length_changed', setVoicesNoiseLength);
	dummyBajotron.arithmeticMixer.addEventListener('mix_function_changed', setVoicesNoiseMixFunction);
	


	reverbNode.output.connect(outputNode);

	voicesNode.connect(reverbNode.input);
	
	setNumVoices(numVoices);
	setVoicesNoiseAmount(0.3);
	setVoicesPortamento(false);

	reverbNode.wetAmount = 0.5;
	
	EventDispatcher.call(this);


	Object.defineProperties(this, {
		numVoices: {
			set: setNumVoices,
			get: function() { return numVoices; }
		},
		reverb: {
			get: function() { return reverbNode; }
		},
		bajotron: {
			get: function() { return dummyBajotron; }
		}
	});

	//

	function setNumVoices(number) {
		
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

			// TODO should clone values from dummy -- clone?
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


	function setVoicesNoiseProperty(property, value) {
		voices.forEach(function(v) {
			v.noiseGenerator[property] = value;
		});
	}


	function setVoicesProperty(propertyPath, value) {
		console.log('set voices property', propertyPath, value);
		var propertyParts = propertyPath.split('.');
		voices.forEach(function(v) {

			if(propertyParts.length === 1) {

				v[propertyParts[0]] = value;

			} else {

				console.log("acceder a 0", propertyParts[0]);

				var prop = v[propertyParts[0]];

				var i = 1;

				while(i < propertyParts.length - 1) {
					var key = propertyParts[i];
					console.log('acceder a ', i, key);
					prop = prop[key];
					i++;
				}

				var lastKey = propertyParts[propertyParts.length - 1];
				console.log('acceder a lo ultimo', lastKey);
				prop[lastKey] = value;
				
			}

		});

	}

	function setVoicesPortamento(value) {
		setVoicesProperty('portamento', value);
	}

	function setVoicesNumVoices(value) {
		setVoicesProperty('numVoices', value);
	}

	function makeADSRListener(adsr, property) {
		return function(ev) {
			setVoicesProperty('adsr.' + property, adsr[property]);
		};
	}

	function setVoicesNoiseType(value) {
		setVoicesProperty('noiseGenerator.type', value);
	}

	function setVoicesNoiseLength(value) {
		setVoicesProperty('noiseGenerator.length', value);
	}

	function setVoicesNoiseAmount(value) {
		setVoicesProperty('noiseAmount', value);
	}

	function setVoicesNoiseMixFunction(value) {
		setVoicesProperty('arithmeticMixer.mixFunction', value);
	}


	// ~~~

	this.guiTag = 'gear-colchonator';

	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined && volume !== null ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var voice;

		voice = getFreeVoice(note);

		voice.noteOn(note, volume, when);

	};


	this.noteOff = function(noteNumber, when) {
		
		var voice = getVoiceByNote(noteNumber);

		console.log('voice = ', voice);

		if(voice) {
			voice.noteOff(when);
		}

		// TODO if number of active voices = 1 -> noise note off

	};


}

module.exports = Colchonator;

},{"./ADSR.js":16,"./Bajotron":18,"./NoiseGenerator":22,"./OscillatorVoice":23,"./Reverbetron":26,"EventDispatcher":1,"midiutils":4}],21:[function(require,module,exports){
var EventDispatcher = require('eventdispatcher');

// A simple mixer for avoiding early deafness
function Mixer(audioContext) {
	'use strict';

	var output = audioContext.createGain();
	var faders = [];
	var numFaders = 8;

	EventDispatcher.call(this);

	initFaders();

	var that = this;

	Object.defineProperties(this, {
		faders: {
			get: function() { return faders; }
		},
		gain: {
			get: function() { return output.gain.value; },
			set: function(v) {
				that.dispatchEvent({ type: 'gain_change', gain: v });
				output.gain.value = v;
			}
		}
	});


	//

	function initFaders() {
		while(faders.length < numFaders) {
			var fader = new Fader(audioContext);
			fader.output.connect(output);
			fader.gain = 0.7;
			fader.label = 'CH ' + (faders.length + 1);
			faders.push(fader);
		}
	}

	// ~~~
	
	this.guiTag = 'gear-mixer';

	this.output = output;

	this.plug = function(faderNumber, audioOutput) {

		if(faderNumber > faders.length) {
			console.error('Mixer: trying to plug into a fader that does not exist', faderNumber);
			return;
		}

		var faderInput = faders[faderNumber].input;
		audioOutput.connect(faderInput);
	};

	this.setFaderGain = function(faderNumber, value) {
		faders[faderNumber].gain = value;
	};
}


function Fader(audioContext, options) {
	
	var gain = audioContext.createGain();
	var label = 'fader';
	var that = this;

	EventDispatcher.call(this);

	Object.defineProperties(this, {
		gain: {
			get: function() {
				return gain.gain.value;
			},
			set: function(v) {
				that.dispatchEvent({ type: 'gain_change', gain: v });
				gain.gain.value = v;
			}
		},
		label: {
			get: function() {
				return label;
			},
			set: function(v) {
				that.dispatchEvent({ type: 'label_change', label: v });
				label = v;
			}
		}
	});


	// ~~~
	

	this.input = gain;
	this.output = gain;

}

module.exports = Mixer;

},{"eventdispatcher":3}],22:[function(require,module,exports){
var SampleVoice = require('./SampleVoice');
var EventDispatcher = require('EventDispatcher');

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

	var that = this;
	var output = audioContext.createGain();
	var sourceVoice;
	var type;
	var length;

	EventDispatcher.call(this);

	options = options || {};

	setType(options.type || 'white');
	setLength(options.length || audioContext.sampleRate);

	buildBuffer(length, type);

	Object.defineProperties(this, {
		type: {
			set: setType,
			get: function() { return type; }
		},
		length: {
			set: setLength,
			get: function() { return length; }
		}
	});

	// 
	
	function buildBuffer(length, type) {

		var noiseFunction, bufferData;

		if(length === undefined || type === undefined) {
			return;
		}

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
		
		var channelData = buffer.getChannelData(0);
		bufferData.forEach(function(v, i) {
			channelData[i] = v;
		});
		
		if(sourceVoice) {
			sourceVoice.output.disconnect();
		}

		sourceVoice = new SampleVoice(audioContext, {
			loop: true,
			buffer: buffer
		});

		sourceVoice.output.connect(output);

	}


	//
	
	function setType(t) {
		buildBuffer(length, t);
		type = t;
		that.dispatchEvent({ type: 'type_changed', typeValue: t });
	}

	function setLength(v) {
		buildBuffer(v, type);
		length = v;
		that.dispatchEvent({ type: 'length_changed', length: v });
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

},{"./SampleVoice":27,"EventDispatcher":1}],23:[function(require,module,exports){
var MIDIUtils = require('midiutils');
var EventDispatcher = require('EventDispatcher');

function OscillatorVoice(context, options) {

	var that = this;
	var internalOscillator = null;
	var gain = context.createGain();

	options = options || {};

	var portamento = options.portamento !== undefined ? options.portamento : true;
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;
	var defaultOctave = 4;
	var octave = defaultOctave;
	// TODO semitones
	var lastNote = null;

	EventDispatcher.call(this);

	Object.defineProperties(this, {
		portamento: {
			get: function() { return portamento; },
			set: setPortamento
		},
		waveType: {
			get: function() { return waveType; },
			set: setWaveType
		},
		octave: {
			get: function() { return octave; },
			set: setOctave
		}
	});

	// 
	
	function setPortamento(v) {
		
		portamento = v;

		that.dispatchEvent({ type: 'portamento_change', portamento: v });

	}


	function setWaveType(v) {

		if(internalOscillator !== null) {
			internalOscillator.type = v;
		}

		waveType = v;

		that.dispatchEvent({ type: 'wave_type_change', wave_type: v });

	}


	function setOctave(v) {

		octave = v;
		
		if(internalOscillator !== null && lastNote !== null) {
			internalOscillator.frequency.value = getFrequency(lastNote);
		}

		that.dispatchEvent({ type: 'octave_change', octave: v });

	}


	function getFrequency(note) {
		return MIDIUtils.noteNumberToFrequency(note - (defaultOctave - octave) * 12);
	}

	// ~~~

	this.output = gain;

	this.noteOn = function(note, volume, when) {

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

		internalOscillator.frequency.value = getFrequency(note);
		internalOscillator.start(when);
		gain.gain.value = volume;

		lastNote = note;

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

},{"EventDispatcher":1,"midiutils":4}],24:[function(require,module,exports){
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
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = 1024;
	var bufferLength = analyser.frequencyBinCount;
	var timeDomainArray = new Uint8Array(bufferLength);

	console.log('buffer length oscilloscope', bufferLength);

	update();

	//

	function update() {

		requestAnimationFrame(update);

		analyser.getByteTimeDomainData(timeDomainArray);

		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgb(0, 255, 0)';

		ctx.beginPath();

		var sliceWidth = canvasWidth * 1.0 / bufferLength;
		var x = 0;


		for(var i = 0; i < bufferLength; i++) {
			
			var v = timeDomainArray[i] / 256.0 - 0.5;
			var y = (v + 1) * canvasHalfHeight;

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
	
	this.input = analyser;
	this.domElement = container;

}

module.exports = Oscilloscope;

},{}],25:[function(require,module,exports){
var BufferLoader = require('./BufferLoader');
var SampleVoice = require('./SampleVoice');
var MIDIUtils = require('MIDIUtils');

function Porrompom(audioContext, options) {

	options = options || {};
	
	var compressor = audioContext.createDynamicsCompressor();
	var outputNode = audioContext.createGain();
	var samples = {};
	var bufferLoader = new BufferLoader(audioContext);
	
	var mappings = options.mappings || {};

	compressor.connect(outputNode);

	loadMappings(mappings);


	//
	

	function loadSample(noteKey, samplePath, callback) {

		bufferLoader.load(samplePath, function(buffer) {
			callback(noteKey, samplePath, buffer);
		});

	}


	function onSampleLoaded(noteKey, samplePath, loadedBuffer) {

		var voice = new SampleVoice(audioContext, {
			buffer: loadedBuffer,
			loop: false,
			nextNoteAction: 'continue'
		});

		samples[samplePath] = voice;
		
		voice.output.connect(compressor);
	}


	function loadMappings(mappings) {
		
		for(var noteKey in mappings) {

			var samplePath = mappings[noteKey];
			
			console.log('Porrompom LOAD', noteKey, samplePath);
		
			// if the sample hasn't been loaded yet
			if(samples[samplePath] === undefined) {
			
				loadSample(noteKey, samplePath, onSampleLoaded);

				// add to buffer load queue
				// on complete, create samplevoice with that buffer

			} else {
				console.log('We already know about', samplePath);
			}
		}
	}

	// ~~~
	
	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
		
		if(mapping) {
			// play sample
			var sample = samples[mapping];

			// It might not have loaded yet
			if(sample) {
				sample.noteOn(44100, 1.0, 0);
			}

		}

	};

}

module.exports = Porrompom;

},{"./BufferLoader":19,"./SampleVoice":27,"MIDIUtils":2}],26:[function(require,module,exports){
var EventDispatcher = require('EventDispatcher');

function Reverbetron(audioContext) {

	var that = this;

	EventDispatcher.call(this);

	var inputNode = audioContext.createChannelSplitter();
	var outputNode = audioContext.createGain();
	
	var convolver = audioContext.createConvolver();
	var dryOutputNode = audioContext.createGain();
	var wetOutputNode = audioContext.createGain();

	var wetAmount = 0;  // default == unfiltered output

	// Build the node chain
	// WET: input -> convolver -> wetOutput (gainNode) -> outputNode
	inputNode.connect(convolver);
	convolver.connect(wetOutputNode);
	wetOutputNode.connect(outputNode);

	// DRY: input -> dryOutput (gainNode) -> outputNode
	inputNode.connect(dryOutputNode);
	dryOutputNode.connect(outputNode);

	setWetAmount(0);

	// Properties
	Object.defineProperties(this, {
		wetAmount: {
			set: setWetAmount,
			get: function() { return wetAmount; }
		},
		impulseResponse: {
			get: function() {
				return convolver.buffer;
			}
		}
	});

	//
	
	function setWetAmount(v) {

		// 0 = totally dry
		wetAmount = v;
		var dryAmount = 1.0 - wetAmount;
		dryOutputNode.gain.value = dryAmount;
		wetOutputNode.gain.value = v;

		that.dispatchEvent({ type: 'wet_amount_change', wetAmount: v });

	}


	// ~~~
	
	this.guiTag = 'gear-reverbetron';

	this.input = inputNode;
	this.output = outputNode;


	this.setImpulse = function(buffer) {
		convolver.buffer = buffer;
		this.dispatchEvent({ type: 'impulse_changed', buffer: buffer });
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

},{"EventDispatcher":1}],27:[function(require,module,exports){
// This voice plays a buffer / sample, and it's capable of regenerating the buffer source once noteOff has been called
// TODO set a base note and use it + noteOn note to play relatively pitched notes

function SampleVoice(audioContext, options) {

	var that = this;

	options = options || {};

	var loop = options.loop !== undefined  ? options.loop : true;
	var buffer = options.buffer || audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
	var nextNoteAction = options.nextNoteAction || 'cut';
	var bufferSource = null;
	var output = audioContext.createGain();

	//

	function prepareBufferSource() {
		bufferSource = audioContext.createBufferSource();
		bufferSource.loop = loop;
		bufferSource.buffer = buffer;
		bufferSource.connect(output);
	}

	// ~~~
	
	this.output = output;
	
	this.noteOn = function(frequency, volume, when) {

		// TODO use frequency

		if(bufferSource !== null) {
			if(nextNoteAction === 'cut') {
				// cut off
				that.noteOff();
			} else {
				// continue - don't stop the note but let it "die away"
				// setting bufferSource to null doesn't stop the sound; we just "forget" about it
				bufferSource = null;
			}
		}

		if(bufferSource === null) {
			prepareBufferSource();
		}
		
		bufferSource.start(when);

		// Auto note off if not looping, though it can be a little bit inaccurate
		// (due to setTimeout...)
		if(!loop && nextNoteAction === 'cut') {
			var endTime = (when + buffer.duration) * 1000;
			
			setTimeout(function() {
				that.noteOff();
			}, endTime);
		}

	};


	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;

		if(bufferSource === null) {
			return;
		}

		bufferSource.stop(when);
		bufferSource = null;

	};

	
}

module.exports = SampleVoice;

},{}],28:[function(require,module,exports){

var adsrProps = ['attack', 'decay', 'sustain', 'release'];

function register() {

	'use strict';

	xtag.register('gear-adsr', {

		lifecycle: {
			created: function() {

				var that = this;

				adsrProps.forEach(function(p) {
					var slider = document.createElement('gear-slider');
					slider.min = 0;
					slider.max = 1;
					slider.step = 0.0001;
					slider.label = p;
					that[p] = slider;
					that.appendChild(slider);
					that.appendChild(document.createElement('br'));
				});

			}
		},

		methods: {

			attachTo: function(adsr) {

				var that = this;

				this.adsr = adsr;
				
				adsrProps.forEach(function(p) {
					
					that[p].value = adsr[p];
					that[p].addEventListener('change', function() {
						var arg = that[p].value*1 + 1;
						var scaledValue = Math.log(arg);
						that.adsr[p] = scaledValue;
					});
					// TODO in the future when properties have setters in ADSR and dispatch events
					// that.adsr[p].addEventListener(p + '_change', function(ev) {
					//	console.log(ev[p]);
					// }, false);

				});

			},

			detach: function() {
				console.error('detach not implemented');
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],29:[function(require,module,exports){
function register() {
	
	'use strict';

	var template = '<select></select>';

	xtag.register('gear-arithmetic-mixer', {

		lifecycle: {
			created: function() {
				
				var that = this;

				this.innerHTML = template;

				this.select = this.querySelector('select');

				['sum', 'multiply'].forEach(function(v) {
					var option = document.createElement('option');
					option.value = v;
					option.innerHTML = v;
					that.select.appendChild(option);
				});

			}
		},

		methods: {

			attachTo: function(arithmeticMixer) {

				this.select.value = arithmeticMixer.mixFunction;

				this.select.addEventListener('change', function() {
					arithmeticMixer.mixFunction = this.value;
				}, false);

				// TODO arithmeticMixer dispatch change events

			}

		}

	});
}

module.exports = {
	register: register
};

},{}],30:[function(require,module,exports){
function register() {
	var bajotronTemplate = '<label>portamento <input type="checkbox" /></label><br/>' +
		'<div class="numVoicesContainer"></div>' +
		'<div class="voices">voices settings</div>' +
		'<div class="adsr"></div>' +
		'<div class="noise">noise<br /></div>'+
		'<div class="noiseMix">mix </div>';

	function updateVoicesContainer(container, voices) {
		
		// remove references if existing
		var oscguis = container.querySelectorAll('gear-oscillator-voice');
		
		for(var i = 0; i < oscguis.length; i++) {
			var oscgui = oscguis[i];
			oscgui.detach();
			container.removeChild(oscgui);
		}

		voices.forEach(function(voice) {
			var oscgui = document.createElement('gear-oscillator-voice');
			oscgui.attachTo(voice);
			container.appendChild(oscgui);
		});

	}


	xtag.register('gear-bajotron', {
		lifecycle: {
			created: function() {

				var that = this;

				this.bajotron = null;

				this.innerHTML = bajotronTemplate;

				this.portamento = this.querySelector('input[type=checkbox]');
				
				this.numVoicesContainer = this.querySelector('.numVoicesContainer');
				this.numVoices = document.createElement('gear-slider');
				this.numVoices.label = 'num voices';
				this.numVoices.min = 1;
				this.numVoices.max = 10;
				this.numVoices.step = 1;
				this.numVoices.value = 1;
				this.numVoicesContainer.appendChild(this.numVoices);
				this.voicesContainer = this.querySelector('.voices');
				
				this.adsrContainer = this.querySelector('.adsr');
				this.adsr = document.createElement('gear-adsr');
				this.adsrContainer.appendChild(this.adsr);

				this.noiseContainer = this.querySelector('.noise');
				this.noiseAmount = document.createElement('gear-slider');
				this.noiseAmount.label = 'amount';
				this.noiseAmount.min = 0;
				this.noiseAmount.max = 1.0;
				this.noiseAmount.step = 0.001;
				this.noiseContainer.appendChild(this.noiseAmount);
				this.noiseContainer.appendChild(document.createElement('br'));
				this.noise = document.createElement('gear-noise-generator');
				this.noiseContainer.appendChild(this.noise);

				this.noiseMix = this.querySelector('.noiseMix');
				this.arithmeticMixer = document.createElement('gear-arithmetic-mixer');
				this.noiseMix.appendChild(this.arithmeticMixer);

			},
		},
		methods: {
			attachTo: function(bajotron) {

				var that = this;
				
				this.bajotron = bajotron;
				
				// Portamento
				this.portamento.checked = bajotron.portamento;
				
				this.portamento.addEventListener('change', function(ev) {
					bajotron.portamento = that.portamento.checked;
				}, false);

				bajotron.addEventListener('portamento_changed', function() {
					that.portamento.checked = bajotron.portamento;
				}, false);

				// Voices
				this.numVoices.value = bajotron.numVoices;

				updateVoicesContainer(that.voicesContainer, bajotron.voices);

				this.numVoices.addEventListener('change', function() {
					bajotron.numVoices = that.numVoices.value;
					updateVoicesContainer(that.voicesContainer, bajotron.voices);
				}, false);

				bajotron.addEventListener('num_voices_change', function() {
					updateVoicesContainer(that.voicesContainer, bajotron.voices);
				}, false);

				// ADSR
				this.adsr.attachTo(bajotron.adsr);

				// Noise
				this.noiseAmount.value = bajotron.noiseAmount;
				this.noise.attachTo(bajotron.noiseGenerator);

				this.noiseAmount.addEventListener('change', function() {
					bajotron.noiseAmount = that.noiseAmount.value;
				}, false);

				bajotron.addEventListener('noise_amount_change', function() {
					that.noiseAmount.value = bajotron.noiseAmount;
				}, false);

				// Noise mix
				this.arithmeticMixer.attachTo(bajotron.arithmeticMixer);
			}
		}
	});

	
}

module.exports = {
	register: register
};


},{}],31:[function(require,module,exports){
var template = '<header>Colchonator</header><div class="numVoicesContainer"></div>' + 
	'<div class="bajotronContainer"></div>' +
	'<div class="reverbContainer"></div>' /*+
	'<div class="adsrContainer"></div>' +
	'<div class="noiseContainer"></div>'*/;


function register() {
	xtag.register('gear-colchonator', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.numVoicesContainer = this.querySelector('.numVoicesContainer');
				this.numVoices = document.createElement('gear-slider');
				this.numVoices.label = 'num voices';
				this.numVoices.min = 1;
				this.numVoices.max = 10;
				this.numVoices.step = 1;
				this.numVoices.value = 1;
				this.numVoicesContainer.appendChild(this.numVoices);

				this.bajotronContainer = this.querySelector('.bajotronContainer');
				this.bajotron = document.createElement('gear-bajotron');
				this.bajotronContainer.appendChild(this.bajotron);

				// TODO - hide some things like the number of voices?

				this.reverbContainer = this.querySelector('.reverbContainer');
				this.reverb = document.createElement('gear-reverbetron');
				this.reverbContainer.appendChild(this.reverb);



				/*this.adsrContainer = this.querySelector('.adsrContainer');
				this.adsr = document.createElement('gear-adsr');
				this.adsrContainer.appendChild(this.adsr);

				this.noiseContainer = this.querySelector('.noiseContainer');
				this.noise = document.createElement('gear-noise-generator');
				this.noiseContainer.appendChild(this.noise);

				this.noiseAmount = document.createElement('gear-slider');
				this.noiseAmount.label = 'noise amount';
				this.noiseAmount.min = 0;
				this.noiseAmount.max = 1;
				this.noiseAmount.step = 0.001;
				this.noiseAmount.value = 0;*/


			}
		},
		methods: {

			attachTo: function(colchonator) {
				var that = this;

				this.colchonator = colchonator;

				this.numVoices.attachToObject(colchonator, 'numVoices', function() {
					console.log('num voices changed', that.numVoices.value);
				}, 'num_voices_change', function() {
					console.log('colchonator num voices changed', colchonator.numVoices);
				});

				// reverb settings/gui
				this.reverb.attachTo(colchonator.reverb);

				// fake bajotron
				this.bajotron.attachTo(colchonator.bajotron);

				// voice ADSR

				// noise
				// this.noise.attachTo(colchonator.noiseGenerator);

			},

			detach: function() {
				//this.voice.removeEventListener('octave_change', this.octaveChangeListener, false);
				//this.voice.removeEventListener('wave_type_change', this.waveTypeChangeListener, false);
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],32:[function(require,module,exports){
var Slider = require('./Slider');
var ADSRGUI = require('./ADSRGUI');
var MixerGUI = require('./MixerGUI');
var NoiseGeneratorGUI = require('./NoiseGeneratorGUI');
var ArithmeticMixerGUI = require('./ArithmeticMixerGUI');
var OscillatorVoiceGUI = require('./OscillatorVoiceGUI');
var ReverbetronGUI = require('./ReverbetronGUI');
var BajotronGUI = require('./BajotronGUI');
var ColchonatorGUI = require('./ColchonatorGUI');

var registry = [
	Slider,
	ADSRGUI,
	MixerGUI,
	NoiseGeneratorGUI,
	ArithmeticMixerGUI,
	OscillatorVoiceGUI,
	ReverbetronGUI,
	BajotronGUI,
	ColchonatorGUI
];


function init() {
	registry.forEach(function(gui) {
		gui.register();
	});
}

module.exports = {
	init: init
};

},{"./ADSRGUI":28,"./ArithmeticMixerGUI":29,"./BajotronGUI":30,"./ColchonatorGUI":31,"./MixerGUI":33,"./NoiseGeneratorGUI":34,"./OscillatorVoiceGUI":35,"./ReverbetronGUI":36,"./Slider":37}],33:[function(require,module,exports){
var template = '<div class="master"></div>' +
	'<div class="sliders"></div>';

function register() {

	'use strict';

	xtag.register('gear-mixer', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.masterContainer = this.querySelector('.master');
				this.masterSlider = document.createElement('gear-slider');
				this.masterSlider.label = 'MST';
				this.masterSlider.min = 0.0;
				this.masterSlider.max = 1.0;
				this.masterSlider.step = 0.01;
				this.masterContainer.appendChild(this.masterSlider);

				this.slidersContainer = this.querySelector('.sliders');
				this.sliders = [];
			}
		},
		
		methods: {

			attachTo: function(mixer) {
				var that = this;

				this.mixer = mixer;
				
				// Length
				this.masterSlider.value = mixer.gain;

				this.masterSlider.addEventListener('change', function() {
					that.mixer.gain = that.masterSlider.value;
				}, false);

				mixer.addEventListener('gain_change', function() {
					that.masterSlider.value = mixer.gain;
				}, false);

				// Channel sliders/faders
				this.slidersContainer.innerHTML = '';
				var faders = mixer.faders;

				faders.forEach(function(fader, index) {
					var slider = document.createElement('gear-slider');

					// copying same parameters for min/max/step from master
					['min', 'max', 'step'].forEach(function(attr) {
						slider[attr] = that.masterSlider.getAttribute(attr);
					});

					slider.label = fader.label;
					slider.value = fader.gain;

					fader.addEventListener('gain_change', function() {
						slider.value = fader.gain;
					}, false);

					slider.addEventListener('change', function() {
						fader.gain = slider.value * 1.0;
					}, false);

					that.slidersContainer.appendChild(slider);
					that.slidersContainer.appendChild(document.createElement('br'));
				});


			},

			detach: function() {
				console.error('detach not implemented');
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],34:[function(require,module,exports){
var template = '<label>colour <select><option value="white">white</option><option value="pink">pink</option><option value="brown">brown</option></select></label><br />';

function register() {

	xtag.register('gear-noise-generator', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.length = document.createElement('gear-slider');
				this.length.min = 44100;
				this.length.max = 96000;
				this.length.step = 1;
				this.length.label = 'length';
				this.appendChild(this.length);
				this.type = this.querySelector('select');
			}
		},
		
		methods: {

			attachTo: function(generator) {
				var that = this;

				this.generator = generator;
				
				// Length
				this.length.value = generator.length;

				this.length.addEventListener('change', function() {
					that.generator.length = that.length.value;
				}, false);

				generator.addEventListener('length_changed', function() {
					that.length.value = generator.length;
				}, false);

				// noise type
				this.type.value = generator.type;

				this.type.addEventListener('change', function() {
					generator.type = that.type.value;
				}, false);

				generator.addEventListener('type_changed', function(ev) {
					that.type.value = generator.type;
				}, false);

			},

			detach: function() {
				console.error('detach not implemented');
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],35:[function(require,module,exports){
var template = '<label>octave <input type="number" min="0" max="10" step="1" value="5" /></label><br />' +
	'<select><option value="sine">sine</option><option value="square">square</option><option value="sawtooth">sawtooth</option><option value="triangle">triangle</option></select>';


function register() {
	xtag.register('gear-oscillator-voice', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.octave = this.querySelector('input[type=number]');
				this.wave_type = this.querySelector('select');

			}
		},
		methods: {

			attachTo: function(voice) {
				var that = this;

				this.voice = voice;
				
				// Octave
				this.octave.value = voice.octave;

				this.octave.addEventListener('change', function() {
					that.voice.octave = that.octave.value;
				}, false);

				function octaveChangeListener() {
					that.octave.value = voice.octave;
				}

				voice.addEventListener('octave_change', octaveChangeListener, false);

				this.octaveChangeListener = octaveChangeListener;

				// Wave type
				this.wave_type.value = voice.waveType;

				this.wave_type.addEventListener('change', function() {
					voice.waveType = that.wave_type.value;
				}, false);

				function waveChangeListener(ev) {
					that.wave_type.value = ev.wave_type;
				}

				voice.addEventListener('wave_type_change', waveChangeListener, false);

				this.waveChangeListener = waveChangeListener;

			},

			detach: function() {
				this.voice.removeEventListener('octave_change', this.octaveChangeListener, false);
				this.voice.removeEventListener('wave_type_change', this.waveTypeChangeListener, false);
			}

		}
	});
}

module.exports = {
	register: register
};

},{}],36:[function(require,module,exports){
var template = '<header>Reverbetron</header><div class="wetContainer"></div>' + 
	'<div><label>Impulse response<select></select><br /><canvas width="200" height="100"></canvas></label></div>';

// TODO: mindblowing === DRAW the impulse response
function register() {

	xtag.register('gear-reverbetron', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.wetAmountContainer = this.querySelector('.wetContainer');
				this.wetAmount = document.createElement('gear-slider');
				this.wetAmount.label = 'wet amount';
				this.wetAmount.min = 0;
				this.wetAmount.max = 1;
				this.wetAmount.step = 0.001;
				this.wetAmount.value = 0;
				this.wetAmountContainer.appendChild(this.wetAmount);

				this.impulsePath = this.querySelector('select');
				this.impulseCanvas = this.querySelector('canvas');
				this.impulseCanvasContext = this.impulseCanvas.getContext('2d');

			}
		},
		methods: {

			attachTo: function(reverbetron) {
				var that = this;

				this.reverbetron = reverbetron;

				this.wetAmount.attachToObject(reverbetron, 'wetAmount');
				
				// impulse (it's a path)
				this.impulsePath.addEventListener('change', function() {
					console.log('ask reverbetron to load', that.impulsePath.value);
					that.reverbetron.loadImpulse(that.impulsePath.value);
				}, false);

				that.reverbetron.addEventListener('impulse_changed', function(ev) {
					that.plotImpulse(ev.buffer);
				}, false);

				that.plotImpulse(that.reverbetron.impulseResponse);

				// checkbox reverb enabled (?)

			},

			detach: function() {
			},

			updateImpulsePaths: function(paths) {
				
				var that = this;
				this.impulsePath.innerHTML = '';
				paths.forEach(function(p) {
					var option = document.createElement('option');
					option.value = p;
					option.innerHTML = p;
					that.impulsePath.appendChild(option);
				});

			},

			plotImpulse: function(buffer) {

				var ctx = this.impulseCanvasContext;
				var canvasWidth = this.impulseCanvas.width;
				var canvasHeight = this.impulseCanvas.height;
				var canvasHalfHeight = canvasHeight * 0.5;

				if(buffer === null) {
					return;
				}

				var bufferData = buffer.getChannelData(0);
				var bufferLength = bufferData.length;

				console.log(bufferData.length, 'buffer data');

				ctx.fillStyle = 'rgb(0, 0, 0)';
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);

				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgb(128, 0, 0)';

				ctx.beginPath();

				var sliceWidth = canvasWidth * 1.0 / bufferLength;
				var x = 0;


				for(var i = 0; i < bufferLength; i++) {

					var v = bufferData[i];
					var y = (v + 1) * canvasHalfHeight;

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

		},

		accessors: {
			impulsePaths: {
				set: function(v) {
					this.updateImpulsePaths(v);
				}
			}
		}
	});

}

module.exports = {
	register: register
};

},{}],37:[function(require,module,exports){
var template = '<label><span class="label"></span> <input type="range" min="0" max="100" step="0.0001" /> <span class="valueDisplay">0</span></label>';

function register() {

	'use strict';

	xtag.register('gear-slider', {
		lifecycle: {
			created: function() {

				var that = this;

				this.innerHTML = template;

				this.slider = this.querySelector('input[type=range]');
				this.slider.addEventListener('change', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					that.value = that.slider.value;

					xtag.fireEvent(that, 'change', { value: that.slider.value });
				}, false);

				this.spanLabel = this.querySelector('.label');
				this.valueDisplay = this.querySelector('.valueDisplay');

				this.value = this.value;
				this.min = this.min;
				this.max = this.max;
				this.step = this.step;
				this.label = this.getAttribute('label');

			}
		},
		accessors: {
			label: {
				set: function(v) {
					this.spanLabel.innerHTML = v;
				},
				get: function() {
					return this.spanLabel.innerHTML;
				}
			},
			value: {
				set: function(v) {
					if(v !== null) {
						this.setAttribute('value', v);
						this.slider.value = v;
						this.valueDisplay.innerHTML = this.slider.value;
					}
				},
				get: function() {
					return this.getAttribute('value');
				}
			},
			min: {
				set: function(v) {
					this.setAttribute('min', v);
					this.slider.setAttribute('min', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('min');
				}
			},
			max: {
				set: function(v) {
					this.setAttribute('max', v);
					this.slider.setAttribute('max', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('max');
				}
			},
			step: {
				set: function(v) {
					this.setAttribute('step', v);
					this.slider.setAttribute('step', v);
					this.value = this.value;
				},
				get: function() {
					return this.getAttribute('step');
				}
			}
		},
		methods: {
			// slider.attachToProperty(bajotron, 'numVoices', onSliderChange, propertyChangeEventName, listener);

			attachToObject: function(object, propertyName, onChange, propertyChangeEvent, propertyChangeListener) {
				console.log('attachToObject', object, propertyName);

				var that = this;
				this.value = object[propertyName];
				console.log('slider: my initial value', object[propertyName]);
				
				// Changes in our slider change the associated object property
				this.addEventListener('change', function() {
					object[propertyName] = that.value;
					if(onChange) {
						onChange();
					}
				}, false);

				// If propertyChangeEventName not null, listen for change events in the object
				// These will update our slider's value
				if(propertyChangeEvent) {
					object.addEventListener(propertyChangeEvent, function() {
						that.value = object[propertyName];
						if(propertyChangeListener) {
							propertyChangeListener();
						}
					}, false);
				}

			}
		}
	});

}

module.exports = {
	register: register
};

},{}],38:[function(require,module,exports){
window.addEventListener('DOMComponentsLoaded', function() {

	var app = require('./app');
	app.start();

}, false);

},{"./app":15}],39:[function(require,module,exports){
var i, j;
var leds = {};
var columnLeds = {};
var rowPads = {};
var basePadPath = '/quneo/leds/pads/';

for(i = 0; i < 4; i++) {
	for(j = 0; j < 4; j++) {
		var base = j * 2 + i * 16;
		var padNumber = i * 4 + j;
		var path = getBasePadPath(padNumber);
		leds[base] = path + 'SW/';
		leds[base + 1] = path + 'SE/';
		leds[base + 8] = path + 'NW/';
		leds[base + 9] = path + 'NE/';
	}
}

for(i = 0; i < 8; i++) {
	var column = [];
	for(j = 0; j < 8; j++) {
		column.push(i + j * 8);
	}
	columnLeds[i] = column;
}

for(i = 0; i < 4; i++) {
	var row = [];
	for(j = 0; j < 4; j++) {
		row.push(i * 4 + j);
	}
	rowPads[i] = row;
}

// path for controlling an individual led out of the 4 leds in each pad
// type = 'green' or 'red'
function getLedPath(ledIndex, type) {
	if(type === undefined) {
		type = '';
	}
	return leds[ledIndex] + type;
}

function getColumnLeds(col) {
	return columnLeds[col];
}

function getBasePadPath(padNumber) {
	return basePadPath + padNumber + '/';
}

// Path for controlling the 4 leds altogether
// padNumber: 0..15
function getPadLedsPath(padNumber, type) {
	if(type === 'undefined') {
		type = 'red';
	}
	return getBasePadPath(padNumber) + '*/' + type;
}

function getRowPads(row) {
	return rowPads[row];
}

function getPlayLedPath() {
	return '/quneo/leds/transportButtons/2';
}

function getStopLedPath() {
	return '/quneo/leds/transportButtons/1';
}

module.exports = {
	getLedPath: getLedPath,
	getColumnLeds: getColumnLeds,
	getPadLedsPath: getPadLedsPath,
	getRowPads: getRowPads,
	getPlayLedPath: getPlayLedPath,
	getStopLedPath: getStopLedPath
};

},{}]},{},[38])
;