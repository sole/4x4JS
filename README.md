# Four to the beat JS

Un-be-lie-va-ble

## To do

- noise generator dispatch events on setters
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
		... discuss...
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
