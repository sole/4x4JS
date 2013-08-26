// This voice plays a buffer / sample, and it's capable of regenerating the buffer source once noteOff has been called
// TODO set a base note and use it + noteOn note to play relatively pitched notes

function SampleVoice(audioContext, options) {

	var that = this;

	options = options || {};

	var loop = options.loop !== undefined  ? options.loop : true;
	var buffer = options.buffer || audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
	var bufferSource = null;
	var output = audioContext.createGain();

	// ~~~
	
	this.output = output;
	
	this.noteOn = function(frequency, volume, when) {

		// TODO use frequency

		// TODO update comments
		// The oscillator node is recreated here "on demand",
		// and all the parameters are set too.
		if(bufferSource === null) {
			bufferSource = audioContext.createBufferSource();
			bufferSource.loop = loop;
			bufferSource.buffer = buffer;
			bufferSource.connect(output);
		}
		
		console.log('samplevoice start', when);
		bufferSource.start(when);

		// Auto note off if not looping, though it can be a little bit inaccurate
		// (due to setTimeout...)
		if(!loop) {
			var endTime = (when + buffer.duration) * 1000;
			console.log('end in', endTime);
			setTimeout(function() {
				that.noteOff();
			}, endTime);
		}

	};


	this.noteOff = function(when) {

		when = when !== undefined ? when : 0;

		if(bufferSource === null) {
			return;
		}

		bufferSource.stop(when /* + audioContext.currentTime*/);
		bufferSource = null;

	};

	
}

module.exports = SampleVoice;
