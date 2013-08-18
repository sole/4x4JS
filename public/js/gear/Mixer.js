// A simple mixer for avoiding early deafness
function Mixer(audioContext) {

	var output = audioContext.createGain();
	var channels = [];
	var numChannels = 16;

	initChannels();

	function initChannels() {
		while(channels.length < numChannels) {
			var fader = new Fader(audioContext);
			fader.output.connect(output);
			fader.setGain(0.7);
			channels.push(fader);
		}
	}

	// ~~~
	
	this.output = output;

	this.plug = function(channelNumber, audioOutput) {

		if(channelNumber > channels.length) {
			console.error('Mixer: trying to plug into a channel that does not exist', channelNumber);
			return;
		}

		var faderInput = channels[channelNumber].input;
		audioOutput.connect(faderInput);
	};

	this.setGain = function(value) {
		output.gain.value = value;
	};
}


function Fader(audioContext, options) {
	
	var gain = audioContext.createGain();

	// ~~~
	
	this.input = gain;
	this.output = gain;

	this.setGain = function(value) {
		gain.gain.value = value;
	};

}

module.exports = Mixer;
