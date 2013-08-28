var BajotronGUI = require('./BajotronGUI');

var registry = [
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
