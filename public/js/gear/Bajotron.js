var MIDIUtils = require('midiutils');
var EventDispatcher = require('EventDispatcher');
var OscillatorVoice = require('./OscillatorVoice');
var NoiseGenerator = require('./NoiseGenerator');
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
	var octaves = [];
	// TODO var semitones = [];
	var outputNode = audioContext.createGain();

	EventDispatcher.call(this);

	parseOptions(options);

	/*var i;
	var vou = valueOrUndefined; // ??? maybe too tricky ???
	
	
	var numVoices = options.numVoices ? options.numVoices : 2;
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
	}*/

	// Voices -> numVoices
	// add -> copy latest settings
	// 

	Object.defineProperties(this, {
		portamento: {
			get: function() { return portamento; },
			set: setPortamento
		},
		numVoices: {
			get: function() { return voices.length; },
			set: setNumVoices
		}
	});

	//
	
	function parseOptions(options) {
		options = options || {};

		setPortamento(options.portamento !== undefined ? options.portamento : false);
		setNumVoices(options.numVoices ? options.numVoices : 2);

	}
	

	function setPortamento(v) {

		portamento = v;
		voices.forEach(function(voice) {
			voice.portamento = v;
		}); // TODO ???
		that.dispatchEvent({ type: 'portamento_change', portamento: v });
	
	}


	function setNumVoices(v) {

		var voice;

		if(v < voices.length) {
			// add voices
			while(v < voices.length) {
				voice = new OscillatorVoice(audioContext, {
					portamento: portamento,
					waveType: defaultWaveType
				});
				voices.push(voice);
				octaves.push(defaultOctave);
			}
		} else {
			// remove voices
			while(v > voices.length) {
				voice = voices.pop();
				octaves.pop();
				voice.output.disconnect();
			}
		}

	}



	// ~~~

	this.guiTag = 'gear-bajotron';

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
