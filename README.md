# Four to the beat JS

Un-be-lie-va-ble

## TO to to do

- improv -> link some instruments
	X switching between instruments
	- interactive input using quneo
- finish gui
	- show/hide gui toggle
- tracker to song -> sets the rhythm/mood
	- curves required to reuse instruments
	- or some simple "sample" effects (because curves require some sort of vsti param which we dont have now)
		- use volume AT LEAST
		- arpeggio

- add 3d to the mix
	- multiple scenes etc
- slides to song


- control filter in instruments with quneo - HUMAN CURVES
- keeping it simple with few instruments-like 'unplugged'

## To do
- filters? better sound.
	- with envelopes?
	- renoise curves -> envelopes
		points set value immediately
- missing guis
	- colchonator
	- porrompom
	- reverbetron
- sampling + play en otras frequencies
- gfx gear
	- fft / spectrum
	- abstract worlds etc
	- things that display notes - listening to note on etc
		- on screen piano
		- more abstract like those youtoube videos representing classical scores
		- cubic player style vis - note dots etc
- noise generator dispatch events on setters
	- needs to be event target, etc
- get something coordinated
	- gui
		-> setters/getters in instruments
		-> sound design
		-> associate some params to hardware controls
		- x-taggy -> put these things in another file, so that components can be reused
	- deck
- vocoder
- note off!!!
- arpeggiator?
- disconnect on note offs?
- define Gear interfaces
	- Our 'when' is relative - is this good?
		- It becomes absolute when used with final audio api objects (eg in oscillatornodes). So far, in:
			- OscillatorVoice
			- SampleVoice
			- ADSR
	- Common methods
		- noteOn(note, volume, when)
		- noteOff
	- Common properties
		- output
			- (almost) every gear component output is a gain node
				- Allows for changing the gain amount of that node, automating it, etc
			- also easy connection:
				someComponent.output.connect(audioContext.destination);
		- input (in some cases --> analyser node)
	- TODO: GearBase class (?)
- 3d
	- ywft
	- spectrum -> shaders
	- notes -> shaders
		camera
- sliditation
	get excited
		affordable synthesis
		accessible, available
	go wild
	go mad / LFO
	- show gui / progressively
	- topics
		- quneo midi controller
			- OSCBridge
				- usb, send messages to local server
					- get touch events
				- set up local server for listening to messages
					- control leds
				- over UDP via node-osc
			- server to browser
				- listen to some messages
					- message syntax
					- regex
				- send some messages
				- socket.io
		- node.js
		- Gear
			- virtual components
				- cheap & affordable
				- easy to travel with them
			- they do stuff of many types
				- audio nodes
					- using web audio and "native blocks"
						- oscillators, buffers, param values
							- wrapped in helper classes
							- oscillators and buffers get autodiscarded
							- param values -> envelopes
						- very modular: inputs and outputs
							- components inside components
					- sometimes native blocks aren't enough
					- plugging in custom nodes using ScriptProcessor
						- audio processing / generation in JS
				- graphic nodes
					- using canvas or web gl
						- three.js
							- composite rendering - many scenes, one renderer
							- no time for modelling with blender/whatever
								- so algorithmical/procedural is the way
					- audio events can be triggered very often
						- limit with requestAnimationFrame
			- gui for some nodes
				- guiTag
				- x-tag based
				- attachTo
					- encapsulation: setters, getters
					- modular again: reusing custom components inside custom compst
		- sync -- Orxatron.Player
			- base song/arrangement sequenced with renoise
				- that's a tracker
				- like sheets of music
				- or like a pianola
				- or "excel for musicians"
			- song is xml based
				- export to json?
				- I wrote a node module because there wasn't any
				- patterns with columns and rows, 
				- and a list of patterns to be played in order (the order list)
			- convert to list of events
			- keep global time-- events are relative to this time
			- web audio events cannot be cancelled
			- so dispatch bursts of events - "requestAuditionFrame"
			- things happen
				- listen to them
				- addEventListener
				- EventDispatcher
				- sadly no custom events because there's no DOM element to dispatch
			- the player doesn't have a clue of what sort of things it's triggering
				- agnostic: noteOn, noteOff
				- note names (C-4...) to standard MIDI note numbers
					- having note numbers allows you to build chords and transpose
					- standard frequencies fit nicely with sampling
					- I built another node module for this
			- since we have the song information that's 'more accurate' than just using ffts - better, delimited sync -> drums, snares
			- the music
				- medley with some of my songs
				- remixed for the occasion
				- space for improvisation
				- and errors (?)
		... more ...
- Orxatron -> npm
	dependencies: eventdispatcher
	- make it use the eventdispatcher packaged in node_modules --as dependency in package.json
- Gear -> npm
	dependencies: eventdispatcher
- gui -> how to test *properly*
- xtag - things in templates don't seem to be having accessors and stuff initialised properly but seem to work OK if instantiated on the fly?

## reusing

Colchonator -> Bajotron, ADSR
Bajotron -> SampleVoice, NoiseGenerator, ADSR
Porrompom -> SampleVoice

## Gear

- Bajotron
- Colchonator
- Porrompom
- Mixer

### 'submodules'

- ADSR
- SampleVoice
- NoiseGenerator

## "track list"

- up the hill
- coffee rulez
- jasmine flowers
- rebuild
- stereopowergalactic
- a.b.r.i.l. original version
