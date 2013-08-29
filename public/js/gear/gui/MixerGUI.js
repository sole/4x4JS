var template = '<gear-slider class="master" label="MST" min="0.0" max="1" step="0.05"></gear-slider>' +
	'<div class="sliders"></div>';

function register() {

	'use strict';

	xtag.register('gear-mixer', {

		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.masterSlider = this.querySelector('.master');
				this.slidersContainer = this.querySelector('.sliders');
				this.sliders = [];
			}
		},
		
		methods: {

			attachTo: function(mixer) {
				var that = this;

				this.mixer = mixer;
				
				// Length
				this.masterSlider.value = mixer.gain;

				this.masterSlider.addEventListener('change', function() {
					that.mixer.gain = that.masterSlider.value;
				}, false);

				mixer.addEventListener('gain_change', function() {
					that.masterSlider.value = mixer.gain;
				}, false);

				// Channel sliders/faders
				this.slidersContainer.innerHTML = '';
				var faders = mixer.faders;

				faders.forEach(function(fader, index) {
					var slider = document.createElement('gear-slider');

					// copying same parameters for min/max/step from master
					['min', 'max', 'step'].forEach(function(attr) {
						slider[attr] = that.masterSlider.getAttribute(attr);
					});

					slider.label = fader.label;
					slider.value = fader.gain;
					console.log('fader', index, fader.label, fader.gain);

					fader.addEventListener('gain_change', function() {
						//slider.value = fader.gain;
						console.log('gain change!', fader.gain, fader);
					}, false);

					slider.addEventListener('change', function() {
						fader.gain = slider.value * 1.0;
					}, false);

					that.slidersContainer.appendChild(slider);
					that.slidersContainer.appendChild(document.createElement('br'));
				});


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
