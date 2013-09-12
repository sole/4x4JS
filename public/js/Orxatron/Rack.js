// very simple 'rack' to represent a uhm... rack of 'machines'
function Rack() {
	var machines = [];
	var guis = [];
	var currentlySelectedIndex = -1;
	var currentMachine = null;
	var selectedClass = 'selected';

	Object.defineProperties(this, {
		selected: {
			get: function() {
				return currentMachine;
			}
		},
		selectedGUI: {
			get: function() {
				return guis[currentlySelectedIndex];
			}
		}
	});

	function updateCurrent() {
		currentMachine = machines[currentlySelectedIndex];

		guis.forEach(function(g) {
			g.classList.remove(selectedClass);
		});

		guis[currentlySelectedIndex].classList.add(selectedClass);
	}


	this.add = function(machine, gui) {

		if(machines.indexOf(machine) === -1) {
			machines.push(machine);
			if(gui === undefined) {
				gui = document.createElement('div');
			}
			guis.push(gui);
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
