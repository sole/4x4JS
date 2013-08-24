function Porrompom(audioContext, options) {

	options = options || {};
	
	var outputNode = audioContext.createGain();
	
	var mappings = options.mappings || {};

	loadMapping(mappings);

	//
	
	function addMapping(data) {

	}


	function loadMapping(mappings) {
		// for mapping in mappings
		// if the sample hasn't been loaded yet
		// add to buffer load queue
		// on complete, create samplevoice with that buffer
	}

	// ~~~
	
	this.output = outputNode;

}

module.exports = Porrompom;
