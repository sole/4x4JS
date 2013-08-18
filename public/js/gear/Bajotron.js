var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');

function Bajotron(audioContext, options) {

	var i;
	
	options = options || {};

	var numVoices = 2; // TODO unhardcode?
	var portamento = options.portamento !== undefined ? options.portamento : false;
	var octaves = options.octaves || [0, 1];
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;

	// if wave type was a single string constant, build an array with that value
	if( Object.prototype.toString.call( waveType ) !== '[object Array]' ) {
		var waveTypes = [];
		for(i = 0; i < numVoices; i++) {
			waveTypes.push(waveType);
		}
		waveType = waveTypes;
	}

	var gain = audioContext.createGain();

	var adsr = new ADSR(audioContext, gain.gain, 0.0, 0.2, 0.05, 0.0);

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

		adsr.beginRelease(when);
		voice.noteOff(when + adsr.release);

	};
}

module.exports = Bajotron;
