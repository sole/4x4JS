var EventDispatcher = require('EventDispatcher');
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');
var Reverbetron = require('./Reverbetron');
var NoiseGenerator = require('./NoiseGenerator');

function Colchonator(audioContext, options) {
	
	options = options || {};

	var numVoices = options.numVoices || 3;

	var voices = [];
	var outputNode = audioContext.createGain();
	var voicesNode = audioContext.createGain();
	var reverbNode = new Reverbetron(audioContext, options.reverb);

	// This dummy node is not connected anywhere-we'll just use it to
	// set up identical properties in each of our internal Bajotron instances
	var dummyBajotron = new Bajotron(audioContext);

	// bajotron events and propagating them...
	dummyBajotron.addEventListener('portamento_changed', function(ev) {
		setVoicesPortamento(ev.portamento);
	});

	dummyBajotron.addEventListener('num_voices_changed', function(ev) {
		setVoicesNumVoices(ev.num_voices);
	});

	dummyBajotron.addEventListener('noise_amount_changed', function(ev) {
		setVoicesNoiseAmount(ev.amount);
	});

	// voiceSettings - octaves and shapes
	// TODO not sure how to do that :-(
	
	['attack', 'decay', 'sustain', 'release'].forEach(function(prop) {
		dummyBajotron.adsr.addEventListener(prop + '_changed', makeADSRListener(prop));
	});

	dummyBajotron.noiseGenerator.addEventListener('type_changed', setVoicesNoiseType);
	dummyBajotron.noiseGenerator.addEventListener('length_changed', setVoicesNoiseLength);
	dummyBajotron.arithmeticMixer.addEventListener('mix_function_changed', setVoicesNoiseMixFunction);
	


	reverbNode.output.connect(outputNode);

	voicesNode.connect(reverbNode.input);
	
	setNumVoices(numVoices);
	setVoicesNoiseAmount(0.3);
	setVoicesPortamento(false);

	reverbNode.wetAmount = 0.5;
	
	EventDispatcher.call(this);


	Object.defineProperties(this, {
		numVoices: {
			set: setNumVoices,
			get: function() { return numVoices; }
		},
		reverb: {
			get: function() { return reverbNode; }
		},
		bajotron: {
			get: function() { return dummyBajotron; }
		}
	});

	//

	function setNumVoices(number) {
		
		var v;

		if(number < voices.length) {

			console.log('Colchonator - reducing polyphony', voices.length, '=>', number);

			while(number < voices.length) {
				v = voices.pop();
				v.voice.noteOff();
				v.voice.output.disconnect();
			}

		} else if(number > voices.length) {

			console.log('Colchonator - increasing polyphony', voices.length, '=>', number);

			// TODO maybe this pseudo cloning thing should be implemented in Bajotron itself
			while(number > voices.length) {
				v = {
					timestamp: 0,
					note: 0,
					/*voice: new Bajotron(audioContext, {
						// this one is pretty crazy!
						// numVoices: 3,
						// octaves: [ -1, 0, 1 ],
						numVoices: dummyBajotron.numVoices,
						adsr: {
							attack: 0.1,
							sustain: 0.7,
							release: 0.5
						},
						noise: {
							type: 'white'
						}
					})*/
				};

				var voice = new Bajotron(audioContext);

				voice.adsr.setParams({
					attack: dummyBajotron.adsr.attack,
					decay: dummyBajotron.adsr.decay,
					sustain: dummyBajotron.adsr.sustain,
					release: dummyBajotron.adsr.release
				});

				voice.numVoices = dummyBajotron.numVoices;
				voice.noiseAmount = dummyBajotron.noiseAmount;
				voice.noiseGenerator.type = dummyBajotron.noiseGenerator.type;
				voice.noiseGenerator.length = dummyBajotron.noiseGenerator.length;
				voice.arithmeticMixer.mixFunction = dummyBajotron.arithmeticMixer.mixFunction;

				v.voice = voice;

				v.voice.output.connect(voicesNode);
				
				voices.push(v);
			}

		}

	}



	function getFreeVoice(noteNumber) {

		var freeVoice;

		// criteria is to return the oldest one
		
		// oldest = the first one,
		// extract it, stop it,
		// and use it just as if it was new
		var oldest = voices.shift();

		oldest.voice.noteOff();
		oldest.note = noteNumber;
		oldest.timestamp = Date.now();

		voices.push(oldest);

		return oldest.voice;

	}


	function getVoiceIndexByNote(noteNumber) {

		for(var i = 0; i < voices.length; i++) {
			var v = voices[i];
			if(v.note === noteNumber) {
				return i;
			}
		}

	}


	function getVoiceByNote(noteNumber) {
		var index = getVoiceIndexByNote(noteNumber);
		if(index !== -1) {
			return voices[index].voice;
		}
	}


	// propertyPath can be any series of dot-delimited nested properties
	// e.g. noiseAmount, adsr.attack, etc...
	// The function takes care of splitting the propertyPath and accessing
	// the final property for setting its value
	function setVoicesProperty(propertyPath, value) {

		var keys = propertyPath.split('.');
		var lastKey = keys.pop();
		var numKeys = keys.length;

		voices.forEach(function(voiceTuple) {

			var voice = voiceTuple.voice;
			var obj = voice;

			for(var i = 0; i < numKeys; i++) {
				obj = obj[keys[i]];
			}

			obj[lastKey] = value;

		});

	}

	function setVoicesPortamento(value) {
		setVoicesProperty('portamento', value);
	}

	function setVoicesNumVoices(value) {
		setVoicesProperty('numVoices', value);
	}

	function makeADSRListener(property) {
		return function(ev) {
			setVoicesProperty('adsr.' + property, ev.value);
		};
	}

	function setVoicesNoiseType(value) {
		setVoicesProperty('noiseGenerator.type', value);
	}

	function setVoicesNoiseLength(value) {
		setVoicesProperty('noiseGenerator.length', value);
	}

	function setVoicesNoiseAmount(value) {
		setVoicesProperty('noiseAmount', value);
	}

	function setVoicesNoiseMixFunction(value) {
		setVoicesProperty('arithmeticMixer.mixFunction', value);
	}


	// ~~~

	this.guiTag = 'gear-colchonator';

	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined && volume !== null ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var voice;

		voice = getFreeVoice(note);

		voice.noteOn(note, volume, when);

	};


	this.noteOff = function(noteNumber, when) {
		
		var voice = getVoiceByNote(noteNumber);

		console.log('voice note off => ', voice);

		if(voice) {
			voice.noteOff(when);
		}

		// TODO if number of active voices = 1 -> noise note off

	};


}

module.exports = Colchonator;
