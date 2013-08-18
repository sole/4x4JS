var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');

function valueOrUndefined(value, defaultValue) {
	return value !== undefined ? value : defaultValue;
}

function Bajotron(audioContext, options) {

	'use strict';

	var i;
	var vou = valueOrUndefined; // ??? maybe too tricky ???
	
	options = options || {};

	var numVoices = options.numVoices ? options.numVoices : 2;
	var portamento = options.portamento !== undefined ? options.portamento : false;
	var octaves = options.octaves || [0, 1];
	// TODO var semitones = [ 0, 5 ] --> 5 = 1 * 12 + 5
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;
	var adsrParams = options.adsr || {};

	// if wave type was a single string constant, build an array with that value
	if( Object.prototype.toString.call( waveType ) !== '[object Array]' ) {
		var waveTypes = [];
		for(i = 0; i < numVoices; i++) {
			waveTypes.push(waveType);
		}
		waveType = waveTypes;
	}

	var gain = audioContext.createGain();

	var adsr = new ADSR(audioContext, gain.gain, vou(adsrParams.attack, 0.0), vou(adsrParams.decay, 0.2), vou(adsrParams.sustain, 0.05), vou(adsrParams.release, 0.10));

	this.output = gain;

	var voices = [];
	for(i = 0; i < numVoices; i++) {
		
		var voice = new OscillatorVoice(audioContext, {
			portamento: portamento,
			waveType: waveType[i]
		});

		voice.output.connect(gain);
		voices.push(voice);
	}

	// ~~~

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		adsr.beginAttack(when);

		voices.forEach(function(voice, index) {
			var frequency = MIDIUtils.noteNumberToFrequency( note + octaves[index] * 12 );
			voice.noteOn(frequency, when);
		});

	};


	this.noteOff = function(noteNumber, when) {

		// Because this is a monophonic instrument, `noteNumber` is quietly ignored
		when = when !== undefined ? when : 0;

		//console.log('bajotron->release', when, 'voice note off in', when + adsr.release, adsr);

		adsr.beginRelease(when);

		voices.forEach(function(voice) {
			voice.noteOff(when + adsr.release);
		});

	};
}

module.exports = Bajotron;
