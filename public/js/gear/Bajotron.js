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

	var adsr = new ADSR(audioContext, gain.gain, 0.2, 0.1, 0.05, 0.0);

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

	
	this.noteOn = function(note /* TODO , volume */) {

		adsr.beginAttack();

		/*var numMessages = 5, rate = 1000 / numMessages;
		var interv = setInterval(function chivato() {
			numMessages--;
			if(numMessages < 0) {
				clearInterval(interv);
			}
			console.log(gain.gain.value);
		}, rate);*/

		voices.forEach(function(voice, index) {
			var frequency = MIDIUtils.noteNumberToFrequency( note + octaves[index] * 12 );
			voice.noteOn(frequency);
		});
	};

	this.noteOff = function() {
		adsr.beginRelease();
		voice.noteOff();
	};
}

module.exports = Bajotron;
