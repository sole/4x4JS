var template = '<input type="number" min="0" max="10" step="1" value="5" /> octave<br />' +
	'<select><option value="sine">sine</option><option value="square">square</option><option value="sawtooth">sawtooth</option><option value="triangle">triangle</option></select>';


function register() {
	xtag.register('gear-oscillator-voice', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.octave = this.querySelector('input[type=number]');

			}
		},
		methods: {
			attachTo: function(voice) {
				var that = this;

				this.voice = voice;
				
				// Octave
				this.octave.value = voice.octave;

				this.octave.addEventListener('change', function() {
					that.voice.octave = that.octave.value;
				}, false);

				voice.addEventListener('octave_change', function() {
					that.octave.value = voice.octave;
				}, false);

				// Wave type
				// TODO

			},
			detach: function() {
				console.error('detach not implemented');
			}
		}
	});
}

module.exports = {
	register: register
};
