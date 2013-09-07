var template = '<div class="wetContainer"></div>';

function register() {
	xtag.register('gear-reverbetron', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.wetAmountContainer = this.querySelector('.wetContainer');
				this.wetAmount = document.createElement('gear-slider');
				this.wetAmount.label = 'wet amount';
				this.wetAmount.min = 0;
				this.wetAmount.max = 1;
				this.wetAmount.step = 0.001;
				this.wetAmount.value = 0;
				this.wetAmountContainer.appendChild(this.wetAmount);

			}
		},
		methods: {

			attachTo: function(reverbetron) {
				var that = this;

				this.reverbetron = reverbetron;

				this.wetAmount.attachToObject(reverbetron, 'wetAmount', function() {
					console.log('wet amount changed', that.wetAmount.value);
				}, 'wet_amount_change', function() {
					console.log('reverbetron num voices changed', reverbetron.wetAmount);
				});

				// impulse (it's a path)
				// checkbox reverb enabled (?)

			},

			detach: function() {
			}

		}
	});
}

module.exports = {
	register: register
};
