function OscillatorVoice(context /* TODO options */) {

	var internalOscillator = null;
	var gain = context.createGain();

	this.output = gain;

	this.noteOn = function(frequency, when) {
		if(internalOscillator === null) {
			internalOscillator = context.createOscillator();
			internalOscillator.connect(gain);
		}
		internalOscillator.frequency.value = frequency;
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

module.exports = OscillatorVoice;
