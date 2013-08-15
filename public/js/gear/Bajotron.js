var OscillatorVoice = require('./OscillatorVoice');

function Bajotron(audioContext) {
	
	var voice = new OscillatorVoice(audioContext);
	var gain = audioContext.createGain();

	voice.output.connect(gain);
	console.log('does this even work?');

	this.output = gain;

	this.noteOn = function(frequency /* TODO , volume */) {
		voice.noteOn(frequency);
	};

	this.noteOff = function() {
		voice.noteOff();
	};
}

module.exports = Bajotron;
