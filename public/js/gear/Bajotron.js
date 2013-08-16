var OscillatorVoice = require('./OscillatorVoice');
var MIDIUtils = require('midiutils');

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
	gain.gain.value = 0.1;
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

		// Envelope
		var gainMax = 0.1;
		var now = audioContext.currentTime;
		gain.gain.cancelScheduledValues(now);
		gain.gain.setValueAtTime(0, now);
		gain.gain.setValueAtTime(gainMax, now + 0.1);
		gain.gain.setValueAtTime(0, now + 0.5);

		var numMessages = 3, rate = 1000 / numMessages;
		var interv = setInterval(function chivato() {
			numMessages--;
			if(numMessages < 0) {
				clearInterval(interv);
			}
			console.log(gain.gain.value);
		}, rate);

		voices.forEach(function(voice, index) {
			var frequency = MIDIUtils.noteNumberToFrequency( note + octaves[index] * 12 );
			voice.noteOn(frequency);
		});
	};

	this.noteOff = function() {
		voice.noteOff();
	};
}

module.exports = Bajotron;
