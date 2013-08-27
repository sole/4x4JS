var EventDispatcher = require('eventdispatcher');

// A simple mixer for avoiding early deafness
function Mixer(audioContext) {
	'use strict';

	var output = audioContext.createGain();
	var faders = [];
	var numFaders = 8;

	EventDispatcher.call(this);

	initFaders();

	var that = this;

	Object.defineProperties(this, {
		faders: {
			get: function() { return faders; }
		},
		gain: {
			get: function() { return output.gain.value; },
			set: function(v) {
				that.dispatchEvent({ type: 'gain_change', gain: v });
				output.gain.value = v;
			}
		}
	});


	var gui = new MixerGUI();
	gui.attachTo(this);


	//

	function initFaders() {
		while(faders.length < numFaders) {
			var fader = new Fader(audioContext);
			fader.output.connect(output);
			fader.gain = 0.7;
			faders.push(fader);
		}
	}

	// ~~~
	
	this.gui = gui.domElement;

	this.output = output;

	this.plug = function(faderNumber, audioOutput) {

		if(faderNumber > faders.length) {
			console.error('Mixer: trying to plug into a fader that does not exist', faderNumber);
			return;
		}

		var faderInput = faders[faderNumber].input;
		audioOutput.connect(faderInput);
	};

	this.setFaderGain = function(faderNumber, value) {
		faders[faderNumber].gain = value;
	};
}


function Fader(audioContext, options) {
	
	var gain = audioContext.createGain();
	var that = this;

	EventDispatcher.call(this);

	Object.defineProperties(this, {
		gain: {
			get: function() {
				return gain.gain.value;
			},
			set: function(v) {
				that.dispatchEvent({ type: 'gain_change', gain: v });
				gain.gain.value = v;
			}
		}
	});

	var gui = new FaderGUI();
	gui.attachTo(this);

	// ~~~
	
	this.gui = gui.domElement;

	this.input = gain;
	this.output = gain;

}


// TODO make these into x-tags so that we have gear-mixer, gear-fader...
// ... and the css is easier
function MixerGUI() {

	var element = document.createElement('div');
	var slider = document.createElement('input');
	slider.type = 'range';
	slider.min = 0.0;
	slider.max = 1.0;
	slider.step = 0.05;

	element.appendChild(document.createTextNode('master gain'));
	element.appendChild(slider);

	// ~~~
	
	this.domElement = element;
	
	this.attachTo = function(mixer) {

		slider.value = mixer.gain;

		mixer.addEventListener('gain_change', function(ev) {
			slider.value = ev.gain;
		}, false);

		slider.addEventListener('change', function() {
			mixer.gain = slider.value;
		}, false);

		var faders = mixer.faders;

		faders.forEach(function(fader) {
			element.appendChild(fader.gui);
		});
	};
}

function FaderGUI() {
	var element = document.createElement('div');
	var slider = document.createElement('input');
	slider.type = 'range';
	slider.min = 0.0;
	slider.max = 1.0;
	slider.step = 0.05;
	
	element.appendChild(slider);

	// ~~~
	
	this.domElement = element;
	
	this.attachTo = function(fader) {

		slider.value = fader.gain;

		// gain changes -> slider value
		fader.addEventListener('gain_change', function(ev) {
			slider.value = ev.gain;
		}, false);

		// slider changes -> gain value
		slider.addEventListener('change', function(ev) {
			fader.gain = slider.valueAsNumber;
		}, false);
	};
}

module.exports = Mixer;
