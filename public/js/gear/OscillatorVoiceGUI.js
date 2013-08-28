var template = '<input type="number" min="0" max="10" step="1" value="5" /> octave<br />' +
	'<select><option value="sine">sine</option><option value="square">square</option><option value="sawtooth">sawtooth</option><option value="triangle">triangle</option></select>';


function register() {
	xtag.register('gear-oscillator-voice', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;
			}
		},
		methods: {
			attachTo: function(voice) {
				this.voice = voice;
				// TODO add listeners
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
