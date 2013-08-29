var template = '<gear-slider label="attack" class="attack" min="0" max="1" step="0.0001"></gear-slider><br />' + 
	'<gear-slider label="decay" class="decay" min="0" max="1" step="0.0001"></gear-slider><br />' +
	'<gear-slider label="sustain" class="sustain" min="0" max="1" step="0.0001"></gear-slider><br />' +
	'<gear-slider label="release" class="release" min="0" max="1" step="0.0001"></gear-slider>';

var adsrProps = ['attack', 'decay', 'sustain', 'release'];

function register() {

	'use strict';

	xtag.register('gear-adsr', {

		lifecycle: {
			created: function() {

				var that = this;

				this.innerHTML = template;

				adsrProps.forEach(function(p) {
					that[p] = that.querySelector('.' + p);
				});

			}
		},

		methods: {

			attachTo: function(adsr) {

				var that = this;

				this.adsr = adsr;
				
				adsrProps.forEach(function(p) {
					
					that[p].value = adsr[p];
					that[p].addEventListener('change', function() {
						var arg = that[p].value*1 + 1;
						var scaledValue = Math.log(arg);
						that.adsr[p] = scaledValue;
					});
					// TODO in the future when properties have setters in ADSR and dispatch events
					// that.adsr[p].addEventListener(p + '_change', function(ev) {
					//	console.log(ev[p]);
					// }, false);

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
