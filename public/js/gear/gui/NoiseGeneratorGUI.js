var template = '<label>colour <select><option value="white">white</option><option value="pink">pink</option><option value="brown">brown</option></select></label><br />' +
	'<gear-slider min="44100" max="96000" step="1" label="length"></gear-slider>';

function register() {

	xtag.register('gear-noise-generator', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.length = this.querySelector('gear-slider');
				this.type = this.querySelector('select');
			}
		},
		
		methods: {

			attachTo: function(generator) {
				var that = this;

				this.generator = generator;
				
				// Length
				this.length.value = generator.length;

				this.length.addEventListener('change', function() {
					that.generator.length = that.length.value;
				}, false);

				/*generator.addEventListener('length_change', function() {
					that.length.value = generator.length;
				}, false);*/

				// noise type
				this.type.value = generator.type;

				this.type.addEventListener('change', function() {
					generator.type = that.type.value;
				}, false);

				/*generator.addEventListener('type_change', function(ev) {
					that.type.value = ev.type;
				}, false);*/

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
