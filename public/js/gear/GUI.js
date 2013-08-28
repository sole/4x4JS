var OscillatorVoiceGUI = require('./OscillatorVoiceGUI');
var BajotronGUI = require('./BajotronGUI');

var registry = [
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
