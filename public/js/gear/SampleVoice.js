// This voice plays a buffer / sample, and it's capable of regenerating the buffer source once noteOff has been called
// TODO set a base note and use it + noteOn note to play relatively pitched notes

function SampleVoice(audioContext, options) {

	var that = this;

	options = options || {};

	var loop = options.loop !== undefined  ? options.loop : true;
	var buffer = options.buffer || audioContext.createBuffer(1, 0, audioContext.sampleRate);
	var bufferSource = null;
	var output = audioContext.createGain();

	// ~~~
	
	this.output = output;
	
	this.noteOn = function(frequency, when) {

		// The oscillator node is recreated here "on demand",
		// and all the parameters are set too.
		if(bufferSource === null) {
			bufferSource = audioContext.createBufferSource();
			bufferSource.loop = loop;
			bufferSource.buffer = buffer;
			bufferSource.connect(output);
		}
		
		bufferSource.start(when + audioContext.currentTime);

		// Auto note off if not looping, a little bit inaccurate (due to setTimeout...)
		if(!loop) {
			setTimeout(function() {
				that.noteOff();
			}, when * 1000);
		}

	};


	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;

		if(bufferSource === null) {
			return;
		}

		bufferSource.stop(when + audioContext.currentTime);
		bufferSource = null;

	};

	
}

module.exports = SampleVoice;
