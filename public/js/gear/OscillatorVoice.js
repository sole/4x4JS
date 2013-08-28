var MIDIUtils = require('midiutils');

function OscillatorVoice(context, options) {

	var internalOscillator = null;
	var gain = context.createGain();

	options = options || {};

	var portamento = options.portamento !== undefined ? options.portamento : true;
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;
	var defaultOctave = 4;
	var octave = defaultOctave;

	Object.defineProperties(this, {
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
	
	function setWaveType(v) {
		if(internalOscillator !== null) {
			internalOscillator.type = v;
		}
		waveType = v;
	}

	function setOctave(v) {
		octave = v;
		// TODO update currently playing oscillator --> need to store the last note etc
	}

	// ~~~

	this.output = gain;

	this.noteOn = function(note, when) {

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
		
		var finalNote = note + (octave - defaultOctave) * 12;
		var frequency = MIDIUtils.noteNumberToFrequency(finalNote);

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
