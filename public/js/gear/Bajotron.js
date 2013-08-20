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
