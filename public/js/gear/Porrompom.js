var BufferLoader = require('./BufferLoader');
var SampleVoice = require('./SampleVoice');
var MIDIUtils = require('MIDIUtils');

function Porrompom(audioContext, options) {

	options = options || {};
	
	var outputNode = audioContext.createGain();
	var samples = {};
	var bufferLoader = new BufferLoader(audioContext);
	
	var mappings = options.mappings || {};

	loadMappings(mappings);


	//
	

	function loadSample(noteKey, samplePath, callback) {
		console.log('loading sample', samplePath, '=>', noteKey);
		
		bufferLoader.load(samplePath, function(buffer) {
			callback(noteKey, samplePath, buffer);
		});

	}


	function onSampleLoaded(noteKey, samplePath, loadedBuffer) {
		console.log('sample loaded', noteKey, samplePath);

		var voice = new SampleVoice(audioContext, {
			buffer: loadedBuffer,
			loop: false
		});

		samples[samplePath] = voice;
		
		voice.output.connect(outputNode);
	}


	function loadMappings(mappings) {
		
		for(var noteKey in mappings) {

			var samplePath = mappings[noteKey];
			
			console.log(noteKey, samplePath);
		
			// if the sample hasn't been loaded yet
			if(samples[samplePath] === undefined) {
			
				loadSample(noteKey, samplePath, onSampleLoaded);

				// add to buffer load queue
				// on complete, create samplevoice with that buffer

			} else {
				console.log('We already know about', samplePath);
			}
		}
	}

	// ~~~
	
	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
		
		if(mapping) {
			console.log(noteKey, '=>', mapping);
			// play sample
			var sample = samples[mapping];

			// It might not have loaded yet
			if(sample) {
				console.log('SAMPLE NOTE ON');
				sample.noteOn(44100, 1.0, 0);
			}

		}

	};

}

module.exports = Porrompom;
