# Four to the beat JS

Un-be-lie-va-ble

## To do
- note off!!!
- disconnect on note offs?
- Reverb -> get impulse responses
- mirar analyser nodes
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
			- Every gear component output is a gain node
				- Allows for changing the gain amount of that node, automating it, etc
			- also easy connection:
				someComponent.output.connect(audioContext.destination);
	- TODO: GearBase class
- player -> jump to position -> changes time position, etc
- gear -> some sort of gui
- sliditation
	get excited
		affordable synthesis
		accessible, available
	go wild
	go mad / LFO
- Orxatron -> npm
