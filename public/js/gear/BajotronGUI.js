function register() {
	var bajotronTemplate = '<input type="checkbox" /> portamento<br/>' +
		'<input type="number" min="1" max="10" step="1" value="1" /> voices<br />' +
		'<div>voices settings</div>' +
		'<div>adsr stuff</div>' +
		'<div>noise type and amount</div>';

	var voiceTemplate = '<input type="number" min="0" max="10" step="1" value="5" /> octave<br />' +
		'<select><option value="square" /></select>';

/*
 * var numVoices = options.numVoices ? options.numVoices : 2;
	var portamento = options.portamento !== undefined ? options.portamento : false;
	var octaves = options.octaves || [0, 1];
	// TODO var semitones = [ 0, 5 ] --> 5 = 1 * 12 + 5
	var waveType = options.waveType || OscillatorVoice.WAVE_TYPE_SQUARE;
	ADSR
	noise, type and amount
 */
	xtag.register('gear-bajotron', {
		lifecycle: {
			created: function() {
				var that = this;

				this.bajotron = null;

				this.innerHTML = bajotronTemplate;

				this.portamento = this.querySelector('input[type=checkbox]');
				this.portamento.addEventListener('change', function(ev) {
					if(that.bajotron) {
						that.bajotron.portamento = that.portamento.checked;
					}
				}, false);
			},
		},
		methods: {
			attachTo: function(bajotron) {
				console.log('gear-bajotron attaching to', bajotron);

				var that = this;
				
				this.bajotron = bajotron;
				
				this.portamento.checked = bajotron.portamento;
				bajotron.addEventListener('portamento_change', function() {
					that.portamento.checked = bajotron.portamento;
				}, false);
			}
		}
	});

}

module.exports = {
	register: register
};

