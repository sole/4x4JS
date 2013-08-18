var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');

function Colchonator(audioContext, options) {
	// input (?)
	//--> No, because it's a Source (?)
	// output -> gainnode output
	// x notes polyphony
	// noise (+param)
	// envelope -> audioGain audioparam (?)
	// noteOn, noteOff
	
	options = options || {};

	var numVoices = options.numVoices || 3;
	var voices = [];
	var outputNode = audioContext.createGain();

	initVoices(numVoices);

	/*function makeVoice() {
		return {
			timestamp: Date.now(),
			oscillator: audioContext.createOscillator()
		};
	}

	function getFreeVoice() {
		
		var freeVoice;

		if(voices.length === numVoices) {

			// get the oldest one, probably stop it, and recreate it
			var oldest = voices[0];
			var oldestIndex = 0;

			for(var i = 1; i < voices.length; i++) {
				var v = voices[i];
				if(v.timestamp < oldest.timestamp) {
					oldest = v;
					oldestIndex = i;
				}
			}

			oldest.oscillator.stop();

			freeVoice = makeVoice();
			voices[oldestIndex] = freeVoice;

		} else {

			// just get a new voice, and store it in the voices array

			freeVoice = makeVoice();
			voices.push(freeVoice);

		}

		return freeVoice;

	}

	function getVoiceByFrequency(frequency) {
		for(var i = 0; i < voices.length; i++) {
			var v = voices[i];
			if( (v.oscillator.frequency - frequency) < 0.001 ) {
				return v;
			}
		}
	}*/

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
				// TODO replace raw oscillator voices with OSC+ADSR units
				v = {
					timestamp: Date.now(),
					note: 0,
					voice: new OscillatorVoice(audioContext)
				};

				v.voice.output.connect(outputNode);
				
				voices.push(v);
			}

		}

	}

	function getFreeVoice(noteNumber) {

		var freeVoice;

		// criteria is to return the oldest one
		var oldest = voices[0];
		var oldestIndex = 0;

		for(var i = 1; i < voices.length; i++) {
			var v = voices[i];

			if(v.timestamp < oldest.timestamp) {
				oldest = v;
				oldestIndex = i;
			}
		}

		oldest.voice.noteOff();
		oldest.note = noteNumber;
		oldest.timestamp = Date.now();

		return oldest.voice;

	}

	function getVoiceByNote(noteNumber) {

		for(var i = 0; i < voices.length; i++) {
			var v = voices[i];
			if(v.note === noteNumber) {
				return v.voice;
			}
		}

	}

	// ~~~

	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		// TODO adsr.beginAttack(when);

		// TODO: use volume

		var voice = getFreeVoice(note);
		var frequency = MIDIUtils.noteNumberToFrequency( note );
		voice.noteOn(frequency, when);


	};

	this.noteOff = function(noteNumber, when) {
		
		console.log('Colchonator NOTE OFF', noteNumber);

		var voice = getVoiceByNote(noteNumber);

		console.log('voice = ', voice);

		if(voice) {
			// TODO adsr.beginRelease(when);
			// voice.noteOff(when + adsr.release);
			voice.noteOff(when);
		}

		/*if(voice) {
			// If a voice with that frequency is found, stop it
			voice.oscillator.stop();
		} else {
			// Otherwise try to stop ALL voices
			voices.forEach(function(v) {
				v.oscillator.stop();
			});
		}*/
	};

}

module.exports = Colchonator;
