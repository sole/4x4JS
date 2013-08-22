function Reverbetron(audioContext) {

	var that = this;
	var convolver = audioContext.createConvolver();


	// ~~~
	
	this.input = convolver;
	this.output = convolver;

	this.setImpulse = function(buffer) {
		convolver.buffer = buffer;
	};

	this.loadImpulse = function(path) {
		console.log('Reverbetron load impulse', path);

		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {

			audioContext.decodeAudioData(request.response, function(buffer) {
					that.setImpulse(buffer);
				},
				function() {
					// onError
				}
			);
		};
		
		request.send();
		
	};
}

module.exports = Reverbetron;
