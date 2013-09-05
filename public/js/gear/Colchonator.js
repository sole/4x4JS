var EventDispatcher = require('EventDispatcher');
var MIDIUtils = require('midiutils');
var OscillatorVoice = require('./OscillatorVoice');
var ADSR = require('./ADSR.js');
var Bajotron = require('./Bajotron');
var Reverbetron = require('./Reverbetron');

function Colchonator(audioContext, options) {
	
	// TODO should we have a global ADSR or go on with the per voice ADSR

	options = options || {};

	var numVoices = options.numVoices || 3;
	var reverbImpulse = options.reverbImpulse;

	var voices = [];
	var outputNode = audioContext.createGain();
	var voicesNode = audioContext.createGain();
	var dryOutputNode = audioContext.createGain();
	var wetOutputNode = audioContext.createGain();
	var reverbNode = new Reverbetron(audioContext);

	if(reverbImpulse) {
		reverbNode.loadImpulse(reverbImpulse);
	}
	reverbNode.output.connect(wetOutputNode);

	voicesNode.connect(dryOutputNode);
	voicesNode.connect(reverbNode.input);

	dryOutputNode.connect(outputNode);
	wetOutputNode.connect(outputNode);




	setWetAmount(0.5);

	setNumVoices(numVoices);
	
	EventDispatcher.call(this);

	Object.defineProperties(this, {
		numVoices: {
			set: setNumVoices,
			get: function() { return numVoices; }
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

			while(number > voices.length) {
				v = {
					timestamp: 0,
					note: 0,
					voice: new Bajotron(audioContext, {
						// this one is pretty crazy!
						// numVoices: 3,
						// octaves: [ -1, 0, 1 ],
						numVoices: 1,
						adsr: {
							attack: 0.1,
							sustain: 0.7,
							release: 0.5
						},
						noise: {
							type: 'white'
						}
					})
				};

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


	function setWetAmount(v) {
		// 0 = totally dry
		var dryAmount = 1.0 - v;
		dryOutputNode.gain.value = dryAmount;
		wetOutputNode.gain.value = v;
	}


	// ~~~

	this.guiTag = 'gear-colchonator';

	this.output = outputNode;

	this.noteOn = function(note, volume, when) {

		volume = volume !== undefined ? volume : 1.0;
		when = when !== undefined ? when : 0;

		var voice;

		console.log('Colchonator noteOn', note, MIDIUtils.noteNumberToName(note));

		voice = getFreeVoice(note);

		voice.noteOn(note, volume, when);

	};


	this.noteOff = function(noteNumber, when) {
		
		console.log('Colchonator NOTE OFF', noteNumber);

		var voice = getVoiceByNote(noteNumber);

		console.log('voice = ', voice);

		if(voice) {
			voice.noteOff(when);
		}

		// if number of active voices = 1 -> noise note off

	};


	this.setWetAmount = function(v) {
		setWetAmount(v);
	};

}

module.exports = Colchonator;
