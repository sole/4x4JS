# Four to the beat JS

"In the era of information overload, simple slides just don’t cut it.

Brace yourselves, for you’re going to experience a never-seen-before JavaScript talk. Or rather, a meta-talk: a continuous, seamless display of rich media content where I’ll describe how you can build this kind of engaging, hypnotic talks that involve the speaker, audio, visuals and a good dose of beats. All it takes is a little bit of rhythm."

This is the software I used for my JSConf.eu talk. To run it you need to fire up the node.js server but before that you need to install the dependencies. So...

* clone
* cd to the dir
* npm install
* cp local.json-dir local.json
* node app.js

In another tab:
* watchify public/js/main.js -o public/build/bundle.js

Or
* browserify public/js/main.js -o public/build/bundle.js

And open http://localhost:7777 in your server

## Controls

* Left/right arrows to move back and forth
* T toggles transport bar
* G toggles gear GUI
* F toggle fullscreen

## To do

There are many things I wanted to do and might do in the future but I didn't have to do in little more than a month for preparing this talk :-)
So let me share with you my to-do list:

- twitter thingie
- bajotron release weirdness
	- if it doesnt reach sustain (?) then on release goes directly to 0 (?)
- use more controls from quneo
- adsr per sample in porrompom for smoother decays
- on screen piano keyboard - try notes without connected controller
- filters? better sound.
	- with envelopes?
	- renoise curves -> envelopes
		points set value immediately
- sampler instrument (different frequencies)
- gfx gear
	- fft / spectrum
	- things that display notes - listening to note on etc
		- more abstract like those youtoube videos representing classical scores
		- cubic player style vis - note dots etc
- vocoder
- disconnect on note offs?
- refactor defining Gear interface ("GearBase" class) (?)
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
				- Allows for changing the gain amount of that node, automating it, etc (?)
			- also easy connection:
				someComponent.output.connect(audioContext.destination);
		- input (in some cases --> analyser node)

- Orxatron -> npm
	dependencies: eventdispatcher
	- make it use the eventdispatcher packaged in node_modules --as dependency in package.json
- Gear -> npm
	dependencies: eventdispatcher
- gui -> how to test *properly* ?
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


