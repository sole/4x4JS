module.exports = function() {
	var socket;

	this.connect = function(address) {
		socket = io.connect(address);
	};
};
