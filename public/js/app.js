var StringFormat = require('stringformat.js');

var audioContext,
	renderer,
	deck,
	guiContainer,
	transportContainer,
	transportTime,
	transportOrder;

var Orxatron = require('./Orxatron/'),
	Quneo = require('./quneo.js'),
	gearGUI = require('./gear/gui/GUI'),
	gear,
	rack;

function start() {

	var rendererContainer = document.getElementById('rendererContainer');

	gearGUI.init();

	deck = document.querySelector('x-deck');
	guiContainer = document.getElementById('gui');
	transportContainer = document.getElementById('transport');

	// load song ajax
	$.ajax({
		url: '/build/data/song.json',
		type: 'GET',
		contentType: 'text/json',
		success: onSongDataLoaded,
		error: function() {
			console.log('ERROR', arguments);
		}
	});

	player = new Orxatron.Player();
	osc = new Orxatron.OSC();

}


function onSongDataLoaded(data) {

	player.loadSong(data);
	player.buildEvents();

	audioContext = new AudioContext();
	gear = initialiseGear(audioContext);
	player.gear = gear; // TODO setter?

	setupGearPlayerListeners(gear, player);
	setupDeck(player, deck);
	setupOSC(gear, player, osc);

	setupKeyboardAndTransport();
	osc.connect('/');

	resetQuneo();

}


function initialiseGear(audioContext) {
	
	var g = [];
	
	rack = new Orxatron.Rack();

	// Audio gear
	// ----------
	var Mixer = require('./gear/Mixer');
	var mixer = new Mixer(audioContext);
	mixer.output.connect(audioContext.destination);
	mixer.gain = 0.25;
	
	// 0 / BASS 
	var Bajotron = require('./gear/Bajotron');
	var bass = new Bajotron(audioContext, {
		portamento: false,
		waveType: ['square', 'triangle'],
		octaves: [3, 4] 
	});
	g.push(bass);

	// 1 / PAD
	var Colchonator = require('./gear/Colchonator');
	var pad = new Colchonator(audioContext);
	pad.numVoices = 3;
	pad.bajotron.noiseAmount = 0;
	pad.bajotron.adsr.attack = 0.3;
	pad.bajotron.adsr.decay = 0.1;
	pad.bajotron.adsr.sustain = 0.95;
	pad.bajotron.adsr.release = 3;

	pad.reverb.loadImpulse('data/impulseResponses/medium-room1.ogg');
	pad.reverb.wetAmount = 0.5;
	g.push(pad);
	
	// 2 / DRUM MACHINE
	var Porrompom = require('./gear/Porrompom');
	var p808 = 'data/samples/808/';
	var dm808 = new Porrompom(audioContext, {
		mappings: {
			'C-4': p808 + 'bassdrum.wav',
			'C#4': p808 + 'snaredrum.wav',
			'D-4': p808 + 'clap.wav',
			'D#4': p808 + 'claves.wav',
			'E-4': p808 + 'cowbell.wav',
			'F-4': p808 + 'hihat_closed.wav',
			'F#4': p808 + 'hihat_open.wav',
			'G-4': p808 + 'maracas.wav',
			'G#4': p808 + 'rimshot.wav',
			'A-4': p808 + 'tom_low.wav'
		}
	});
	g.push(dm808);

	// 3 / Congas drum machine
	var pCongas = 'data/samples/congas/';
	var dmCongas = new Porrompom(audioContext, {
		mappings: {
			'C-4': pCongas + 'CONGUI.wav',
			'C#4': pCongas + 'CONGUI2.wav',
			'D-4': pCongas + 'CONGUI3.wav',
			'D#4': pCongas + 'CONGUI4.wav',
			'E-4': pCongas + 'CONGUI5.wav'
		}
	});
	g.push(dmCongas);

	// 4 / Arpeggiator sort of
	var arp = new Bajotron(audioContext, {
		portamento: false,
		waveType: ['square', 'triangle'],
		octaves: [3, 4]
	});
	g.push(arp);


	// Plug instruments into the mixer
	g.forEach(function(instrument, index) {
		mixer.plug(index, instrument.output);
	});
	
	//mixer.setFaderGain(0, 0.1);
	//mixer.setFaderGain(1, 0.0);
	
	var Oscilloscope = require('./gear/Oscilloscope');
	var oscilloscope = new Oscilloscope(audioContext);
	mixer.output.connect(oscilloscope.input);
	oscilloscope.domElement.id = 'oscilloscope';
	document.body.appendChild(oscilloscope.domElement);

	// GFX gear
	// --------
	// TODO gfx gear!

	// Gear GUI
	// --------
	var mixerGUI = document.createElement(mixer.guiTag);
	mixerGUI.attachTo(mixer);
	guiContainer.appendChild(mixerGUI);

	// TODO tmp, should append them all consecutively
	var bassGUI = document.createElement(bass.guiTag);
	bassGUI.attachTo(bass);
	guiContainer.appendChild(bassGUI);


	var padGUI = document.createElement(pad.guiTag);
	padGUI.attachTo(pad);
	var impulsePath = 'data/impulseResponses/';
	padGUI.reverb.impulsePaths = [
		impulsePath + 'cave.ogg',
		impulsePath + 'medium-room1.ogg'
	];
	guiContainer.appendChild(padGUI);

	var arpGUI = document.createElement(arp.guiTag);
	arpGUI.attachTo(arp);
	guiContainer.appendChild(arpGUI);

	rack.add(bass, bassGUI);
	rack.add(pad, padGUI);
	rack.add(dm808);
	rack.add(dmCongas);
	rack.add(arp, arpGUI);

	return g;
}


function setupGearPlayerListeners(gear, player) {
	// listeners player <-> gear
	
	console.warn('TODO setupGearPlayerListeners');
}


function setupOSC(gear, player, osc) {

	var prefix = '\/quneo\/'; // Because I'm lazy.

	// osc.input -> gear
	// -----------------
	var activePads = [];
	for(var k = 0; k < 16; k++) {
		activePads.push(false);
	}

	osc.on(prefix + 'pads\/(\\d+)\/drum\/pressure', null, function(match, value) {
		
		var selected = rack.selected;
		var pressure = value;

		if(selected) {
			var padIndex = match[1] * 1;
			var note = 40 /* middle C */ + padIndex;
			var activeAlready = activePads[padIndex];

			if(activeAlready) {

				// TODO timeout for actually being very subtle and light touches
				// arbitrary 'low' threshold
				if(pressure <= 3) {
					// release
					selected.noteOff(note);
					activePads[padIndex] = false;
				} else {
					// Modulate current note with volume
					var volume = pressure / 64.0;
					var scaledVolume = Math.sqrt(volume);
					selected.setVolume(note, scaledVolume);
				}

			} else {
				// Another arbitrary threshold to prevent happy retrigging
				if(pressure > 16) {
					selected.noteOn(note);
					activePads[padIndex] = true;
				}
			}
		}
	});

	// TODO: "mixer" -> sample cue points (granular...)
	// TODO: up/down (left/right) to select which sample to play, and trigger it
	

	// osc.input -> player
	// -------------------
	// PLAY -> player.play
	osc.on(prefix + 'transport\/2\/note_velocity', 127, play);
	// STOP -> player.pause
	osc.on(prefix + 'transport\/1\/note_velocity', 127, pause);

	// up/down -> move focus to prev/next instrument in rack
	osc.on(prefix + 'upButton\/0\/note_velocity', 0, focusPrevInstrument);
	osc.on(prefix + 'downButton\/0\/note_velocity', 0, focusNextInstrument);

	// player -> osc.output
	// --------------------
	
	// TODO: flash play button to the beat
	// TODO: flash stop button at 0.5
	
	// Use pad columns/grid as pattern/line indicator
	// Turn columns on/off as the song is played
	var lastColumn = null;
	var lastRow = null;
	player.addEventListener('row_change', function(ev) {
		
		var columnNumber = ev.row % 8;
		var columnLeds = Quneo.getColumnLeds(columnNumber);
		var patternLength = 128; // XXX TODO WARNING HARDCODED!!!
		var patternQuarterLength = patternLength >> 2;
		var rowNumber = ((patternLength - 1 - ev.row) / patternQuarterLength) | 0;
		var rowPads = Quneo.getRowPads(rowNumber);

		transportOrder.innerHTML = 'Order: ' + ev.order + ', Pattern: ' + StringFormat.pad(ev.pattern | 0, 2, '0') + ', Row: ' + StringFormat.pad(ev.row | 0, 2, '0') + '/' + StringFormat.pad(patternLength, 2, '0');
		
		if(lastColumn !== null) {
			// Turn older off
			var prevLeds = Quneo.getColumnLeds(lastColumn);
			prevLeds.forEach(function(index) {
				osc.send(Quneo.getLedPath(index, 'red'), 0);
				osc.send(Quneo.getLedPath(index, 'green'), 0);
			});
		}

		if(lastRow !== null && lastRow != rowNumber) {
			// same
			var prevPads = Quneo.getRowPads(lastRow);
			prevPads.forEach(function(index) {
				osc.send(Quneo.getPadLedsPath(index, 'red'), 0);
				osc.send(Quneo.getPadLedsPath(index, 'green'), 0);
			});
		}

		rowPads.forEach(function(index) {
			var v = 0.15;
			osc.send(Quneo.getPadLedsPath(index, 'green'), v);
			osc.send(Quneo.getPadLedsPath(index, 'red'), v);
		});

		columnLeds.forEach(function(index) {
			var path = Quneo.getLedPath(index, 'red');
			osc.send(path, 0.5);
		});

		
		lastColumn = columnNumber;
		lastRow = rowNumber;

	}, false);

	

	// TODO: vumeters?

}

function resetQuneo() {

	// Turn play button ON to show we're ready
	osc.send(Quneo.getPlayLedPath(), 1.0);

	// Initially turn off all the pads just in case something remained
	for(var i = 0; i < 16; i++) {
		osc.send(Quneo.getPadLedsPath(i, 'green'), 0);
		osc.send(Quneo.getPadLedsPath(i, 'red'), 0);
	}
}


function setupDeck(player, deck) {
	// player -> deck

	player.addEventListener('order_change', function(ev) {
		// 'reduce' to showing 1 slide every 4 orders
		var slideIndex = (ev.order / 4) | 0;
		var activeCard = deck.getSelectedCard();
		var activeCardIndex = deck.getCardIndex(activeCard);

		slideIndex = ev.order; // TMP
		if(activeCardIndex !== slideIndex) {
			console.log('deck ⇒ shuffle to', slideIndex);
			try {
				deck.shuffleTo(slideIndex);
			} catch(e) {
				// just in case we're missing slides
			}
		}
	}, false);
}


function setupKeyboardAndTransport() {
	// Just in case OSC is not available!
	$('#play').on('click', play);
	$('#pause').on('click', pause);
	$('#rew').on('click', function() {
		playerJumpTo(-1);
	});
	$('#fwd').on('click', function() {
		playerJumpTo(1);
	});

	transportTime = document.getElementById('time');
	transportOrder = document.getElementById('order');

	window.addEventListener('keyup', function(ev) {
	
		var code = ev.keyCode;
		//console.log(code);
		switch(code) {
			case 70: toggleFullScreen(); break;
			case 71: toggleGUI(); break;
			case 84: toggleTransport(); break;
		}

	}, false);
}

function play() {
	if(!player.isPlaying()) {
		player.play();

		updatePlayStatus();
		osc.send(Quneo.getStopLedPath(), 0.5);
	}
}


function updatePlayStatus() {
	var t = Date.now() * 0.01;
	var v = (2 + Math.sin(t)) * 0.25;
	osc.send(Quneo.getPlayLedPath(), v);
	transportTime.innerHTML = StringFormat.secondsToHHMMSS(audioContext.currentTime);
	requestAnimationFrame(updatePlayStatus);
}


function pause() {
	player.pause();
	cancelAnimationFrame(updatePlayStatus);
	osc.send(Quneo.getPlayLedPath(), 0);
}


function playerJumpTo(offset) {
	
	var newOrder = player.currentOrder + offset;
	var numOrders = player.orders.length;

	if(newOrder > numOrders) {
		newOrder = 0;
	} else if(newOrder < 0) {
		newOrder = numOrders - 1;
	}

	player.jumpToOrder(newOrder, 0);

}


function toggleFullScreen() {
	console.log('toggle fs');
}

function toggleGUI() {
	guiContainer.classList.toggle('hidden');
}

function toggleTransport() {
	transportContainer.classList.toggle('hidden');
}

function focusPrevInstrument() {
	//var current = rack.selectedGUI;
	//current.classList.remove('selected');

	rack.selectPrevious();

	//rack.selectedGUI.classList.add('selected');

}


function focusNextInstrument() {
	rack.selectNext();
}


module.exports = {
	start: start
};
