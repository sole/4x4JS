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
	var outputGain = audioContext.createGain();

	function makeVoice() {
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
	}

	// ~~~

	this.output = outputGain;

	this.noteOn = function(frequency) {
		var voice = getFreeVoice();
		voice.oscillator.frequency.value = frequency;
		voice.oscillator.start();
	};

	this.noteOff = function(frequency) {
		var voice = getVoiceByFrequency();
		if(voice) {
			// If a voice with that frequency is found, stop it
			voice.oscillator.stop();
		} else {
			// Otherwise try to stop ALL voices
			voices.forEach(function(v) {
				v.oscillator.stop();
			});
		}
	};

}

module.exports = Colchonator;
