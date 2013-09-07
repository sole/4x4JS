// very simple 'rack' to represent a uhm... rack of 'machines'
function Rack() {
	var machines = [];
	var currentlySelectedIndex = -1;
	var currentMachine = null;

	Object.defineProperties(this, {
		selected: {
			get: function() {
				return currentMachine;
			}
		}
	});

	function updateCurrent() {
		currentMachine = machines[currentlySelectedIndex];
	}


	this.add = function(machine) {

		if(machines.indexOf(machine) === -1) {
			machines.push(machine);
		}

		if(currentlySelectedIndex === -1) {
			currentlySelectedIndex = 0;
		}

		updateCurrent();
	
	};


	this.selectNext = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = ++currentlySelectedIndex % machines.length;

		updateCurrent();

	};


	this.selectPrevious = function() {

		if(machines.length === 0) {
			return;
		}

		currentlySelectedIndex = --currentlySelectedIndex < 0 ? machines.length - 1 : currentlySelectedIndex;

		updateCurrent();

	};

}

module.exports = Rack;
