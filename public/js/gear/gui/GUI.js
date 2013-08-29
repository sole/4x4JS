var Slider = require('./Slider');
var ADSRGUI = require('./ADSRGUI');
var NoiseGeneratorGUI = require('./NoiseGeneratorGUI');
var OscillatorVoiceGUI = require('./OscillatorVoiceGUI');
var BajotronGUI = require('./BajotronGUI');

var registry = [
	Slider,
	ADSRGUI,
	NoiseGeneratorGUI,
	OscillatorVoiceGUI,
	BajotronGUI
];


function init() {
	registry.forEach(function(gui) {
		gui.register();
	});
}

module.exports = {
	init: init
};
