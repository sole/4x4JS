var OscillatorVoice = require('./OscillatorVoice');
var MIDIUtils = require('midiutils');

function Bajotron(audioContext, options) {
	
	options = options || {};
	var portamento = options.portamento !== undefined ? options.portamento : false;
	var octaves = options.octaves || [0, 1];

	var gain = audioContext.createGain();

	var voices = [];
	for(var i = 0; i < 2; i++) {
		var voice = new OscillatorVoice(audioContext, {
			portamento: portamento
		});
		voice.output.connect(gain);
		voices.push(voice);
	}

	this.output = gain;

	this.noteOn = function(note /* TODO , volume */) {
		voices.forEach(function(voice, index) {
			var frequency = MIDIUtils.noteNumberToFrequency( note + octaves[index] * 12 );
			voice.noteOn(frequency);
		});
		//voice.noteOn(frequency);
	};

	this.noteOff = function() {
		voice.noteOff();
	};
}

module.exports = Bajotron;
