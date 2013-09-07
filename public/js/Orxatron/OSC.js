module.exports = function() {
	var socket;
	var listeners = [];

	function onMessage(data) {

		var address = data[0];
		var value = data[1];

		findMatch(address, value);

	}

	function findMatch(address, value) {
		var listener, match;

		for(var i = 0; i < listeners.length; i++) {
			
			listener = listeners[i];
			match = listener.regexp.exec(address);

			if(match) {

				if(listener.expectedValue === null || 
					listener.expectedValue !== null && listener.expectedValue === value) {

					// console.log('MATCH', address, listener.regexp, match, 'expected', listener.expectedValue, 'actual value', value);
					listener.callback(match, value);

					break;

				}

			}
		}

		
	}



	this.connect = function(address) {

		socket = io.connect(address);

		// whenever we receive an 'osc' message from the back-end, process it with onMessage
		socket.on('osc', onMessage);

	};

	
	this.on = function(address, expectedValue, callback) {
		
		var re = new RegExp(address, 'g');

		// console.log(address, '->', re);
		
		var listener = {
			regexp: re,
			expectedValue: expectedValue,
			callback: callback
		};

		listeners.push(listener);

	};


	this.send = function(address, value) {

		socket.emit('message', [address, value]);

	};

	
};
