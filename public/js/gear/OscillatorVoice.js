function OscillatorVoice(context, options) {

	var internalOscillator = null;
	var gain = context.createGain();

	options = options || {};

	var portamento = options.portamento !== undefined ? options.portamento : true;

	this.output = gain;

	this.noteOn = function(frequency, when) {

		if(!portamento) {
			this.noteOff(0);
		}

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
