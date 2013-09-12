var BufferLoader = require('./BufferLoader');
var SampleVoice = require('./SampleVoice');
var MIDIUtils = require('MIDIUtils');

function Porrompom(audioContext, options) {

	options = options || {};
	
	var compressor = audioContext.createDynamicsCompressor();
	var outputNode = audioContext.createGain();
	var samples = {};
	var bufferLoader = new BufferLoader(audioContext);
	
	var mappings = options.mappings || {};

	compressor.connect(outputNode);

	loadMappings(mappings);


	//
	

	function loadSample(noteKey, samplePath, callback) {

		bufferLoader.load(samplePath, function(buffer) {
			callback(noteKey, samplePath, buffer);
		});

	}


	function onSampleLoaded(noteKey, samplePath, loadedBuffer) {

		var voice = new SampleVoice(audioContext, {
			buffer: loadedBuffer,
			loop: false,
			nextNoteAction: 'continue'
		});

		samples[samplePath] = voice;
		
		voice.output.connect(compressor);
	}


	function loadMappings(mappings) {
		
		for(var noteKey in mappings) {

			var samplePath = mappings[noteKey];
			
			console.log('Porrompom LOAD', noteKey, samplePath);
		
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

	// !!!!!!!!!!!!!!!! TODO ALARM !!!!!!!!!!!!!!!!!
	// !!LOTS OF COPY PASTING IN THIS FILE!!!!!!!!!!
	// AWFULAWFULAWFULAWFULAWFULAWFULAWFULAWFULAWFUL
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	// ~~~
	
	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
	
		
		if(mapping) {
			// play sample
			var sample = samples[mapping];

			// It might not have loaded yet
			if(sample) {

				volume = volume !== undefined && volume !== null ? volume : 1.0;
				when = when !== undefined ? when : 0;

				var audioWhen = when + audioContext.currentTime;

				sample.noteOn(44100, volume, audioWhen);
			}

		}

	};
	

	this.setVolume = function(noteNumber, volume, when) {

		var noteKey = MIDIUtils.noteNumberToName(noteNumber);
		var mapping = mappings[noteKey];

		when = when !== undefined ? when : 0;

		var audioWhen = when + audioContext.currentTime;
		
		if(mapping) {
			var sample = samples[mapping];
			if(sample) {
				sample.setVolume(volume, audioWhen);
			}
		}

	};


	this.noteOff = function(note, when) {

		var noteKey = MIDIUtils.noteNumberToName(note);
		var mapping = mappings[noteKey];
	
		if(mapping) {

			var sample = samples[mapping];

			if(sample) {
				when = when !== undefined ? when : 0;

				var audioWhen = when + audioContext.currentTime;

				sample.noteOff(audioWhen);
			}

		}

	};



}

module.exports = Porrompom;
