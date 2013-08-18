var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');

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
						numVoices: 1,
						adsr: {
							attack: 0.1,
							sustain: 0.7,
							release: 0.3
						}
					})
				};

				v.voice.output.connect(outputNode);
				
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

	};

}

module.exports = Colchonator;
