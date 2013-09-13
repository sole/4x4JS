# Four to the beat JS

Un-be-lie-va-ble

## TO to to do

SUPER BROKEN

- bajotron release doesn't work properly
	- weirdness if it doesnt reach sustain (?) then on release goes directly to 0

- twitter thingie
- slides
- multiple scenes etc
- Patrones/16 filas -> slide





Nice to have but not feasible

- tracker to song -> sets the rhythm/mood
	- curves required to reuse instruments
	- or some simple "sample" effects (because curves require some sort of vsti param which we dont have now)
- param horiz sliders -> asociar a algo en gear
- en porrompom, adsr por sample para dejar que acaben (?)
- slides to song
- audio tags keyboard - para poder probar cosas sin el quneo

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
	- mozilla
	- html5 5
	- encourage to build
	- topics
		1- I /love/ music
			- one of my first christmas gifts was a 2xLP - one was BLUE!!!
			- wouldn't stop asking my parents to play it once and once again
			- early challenge: reach the turntable, put the needle back
		2- Music everywhere on my town
			- annual festivities ~ 1 wk of street music
			- sit on a narrow street, listen to band after band
			- wondering how did those wind instruments work
		3- Fascinated with machines of all sorts
			- valve radios
			- huge radios
			- tapes
		4- the 80s were good times
			- cheesy electropop
			- videogames
			- casio keyboards
		5- PT-100: composing music
			- limited configurability
			- recording to a tape
			- it was OK
		6- OMG MULTIMEDIA!!!
			- Trackers!
			- Sample based
			- Early visualisations
		7- Demoscene
			- VJing
			- live gigs!
			- fame (sort of)
		8- Software synthesis
			- C/C++
			- VSTi
			- Hard to distribute, proprietary
		9- OMG JavaScript!
			- Web Audio!
			- Web GL!
			- Node.js!
		10- One-woman orchestra, with JS
			- Audio & Video output
			- Hardware input
			- Node.js glues things together
		11- HW: quneo midi controller
			- "for hackers"
			- LEDs
			- smallish ~ iPad size
		12- Hardware -> node: with OSCBridge
			- usb -> send messages to local server
				- get touch events
			- connect to local server for listening to messages
				- not a synth, so just led control
			- over UDP via node-osc
		13- server to browser
			- glued with socket.io
			- "subscribe" to some messages
				- message syntax e.g. /quneo/pads/2/drum/pressure
				- regex /quneo/pads\/(\\d+)\/drum\/pressure
			- also send some messages (led control)
		14- Gear
			- evidently, virtual
			- proof of concept
			- audio and video gear
		15- Audio gear
			- Modular, Web Audio philosophy
				- inputs, outputs
				- components inside components
			- Wrapping basic blocks in helpers
				- oscillators & buffers autodiscarded
				- param values -> envelopes
			- Also custom nodes with ScriptProcessor - audio processing in JS
		16- Video gear
			- webgl via three.js for maximum performance
			- composite rendering - many scenes, 1 renderer
			- I &lt;3  procedural
		17- GUI! (bring it up NOW) (touch bass)
			- Web components (based in x-tag)
			- attachTo a component
			- event based
		18- Sync: Player
			- base song sequenced in renoise
			- it's a tracker
			- future: web editing too
		19- renoise song xml based
			- export to json
				- wrote node module because there wasn't any
			- patterns, columns and rows
			- list of patterns to be played in order (order list)
		20- List of events
			- time sorted
			- web audio events cannot be cancelled
			- dispatch bursts of events - 'requestAuditionFrame'
		21- Agnostic player (doesn't have a clue of what sort of things it's triggering)
			- noteOn, noteOff
			- note names to standard MIDI note numbers
				- good for building chords + transposing!
				- standard frequencies fit with tuned samples
			- video gear can use those values too (e.g. scaling)
		22- Accuracy
			- song data: more accurate than FFT (e.g. dancer.js)
			- tempo, notes
			- we can react to very specific events (drum, snare, instr note)
		23- Listening to events
			- addEventListener
			- EventDispatcher
			- sadly no custom events because there's no DOM element to dispatch
		[TODO]
			- GOTCHAS
				- compressors and reduce volumes to avoid distortion
				- 
		24- What you're listening to
			- My songs in exclusive arrangement for this event
			- space for improvisation
			- ... and errors!
		25- You can play too
			- Mention @supersole or @jsconfeu
			- Hopefully the network will behave
			- Fingers crossed!
		26 - PARTY!!!
			(FREE STYLE)
			...
		- Thanks!
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

ACTUAL
- pseudo resurrection ethnic mix
- up the hill
- stereopowergalactic (~2 min!)
- hyperaktive dancing

PROPOSED
- up the hill
- coffee rulez
- jasmine flowers (C, Am, Dm, Bb / C, Am, F, G) | bridge: Em, C, Em, C, / Dm, G, Dm, G 
- rebuild
- stereopowergalactic
- a.b.r.i.l. original version
- oldie times
- dark tech (partially)
- pi^2
- happy zonan
- when I try to forget
- VLC091011 (would be nice to play bells/lead)
- tururu chimpum
- last night in atlantis (chords Am/C/Em/G)
- resurrection ethnic (v good intro! chords Am, C, G, Dm)
- over the atmosphere (ethnic)
- hyperaktive dancing (play bongos)

semi hard (arpeggios/portamento/retriggers)

- travelling around - heavily sample based but ethnic so makes a difference
	- improvising -> percussion
- ladrilloids
- 10 years ago
- i'm ok - you're ok
	(playing the lead/guitars - without keyboard)
	- so rhythm would be easier!
- tokyo garden simplified + needs super reverb in the lead
- m41d4 v4l3 (arpeggios)
- you're so nice
- puni puni
- pika pika polka
- como mola (doable chords Am/Dm/G/C)
- the sweetest song (vocoder, chords easy Am, Dm, C, G)
- semos los vengatas (chords easy Am, G, Am, C)
- they are still shining (vocoder) & slightly confusing
	- chords Am, F, Dm, Em
- hard dreamings (chords Am, C, Dm, F)
- sunny day (chord C Em F G)

possibly too hard:

- a dream of sorts
- horizon blue
- flight 5135 (would be nice to play the lead)
- tomorrow (vocoder) <-- PUNTAZO
- 71st grooving heaven (sample based for the groove bass)
- near the limits (vocoder) samples Dm, Am, Bb, F-C
