var template = '<label><span class="label"></span> <input type="range" min="0" max="100" step="0.0001" /> <span class="valueDisplay">0</span></label>';

function register() {

	'use strict';

	function setValue(v) {
		console.log('set value', v, this);
		if(this !== undefined) {
			this.slider.value = v;
			this.valueDisplay.innerHTML = this.slider.value;
			this.value = v;
		}
	}

	xtag.register('gear-slider', {
		lifecycle: {
			created: function() {
				var that = this;

				this.innerHTML = template;

				this.slider = this.querySelector('input[type=range]');
				this.slider.addEventListener('change', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					setValue.call(that, that.slider.value);

					xtag.fireEvent(that, 'change', { value: that.slider.value });
				}, false);
				
				this.spanLabel = this.querySelector('.label');
				this.valueDisplay = this.querySelector('.valueDisplay');
				
				// not really...
				//setValue.call(this, this.value);
				//this.value = this.getAttribute('value');
				this.value = this.value;
				this.min = this.min;
				this.max = this.max;
				this.step = this.step;
				this.label = this.getAttribute('label');

			}
		},
		accessors: {
			label: {
				set: function(v) {
					this.spanLabel.innerHTML = v;
				},
				get: function() {
					return this.spanLabel.innerHTML;
				}
			},
			value: {
				set: function(v) {
					setValue(v);
				},
				get: function() {
					return this.getAttribute('value');//this.slider.value;
				}
			},
			min: {
				set: function(v) {
					this.setAttribute('min', v);
					this.slider.setAttribute('min', v);
					setValue.call(this, this.value);
				},
				get: function() {
					return this.getAttribute('min');
				}
			},
			max: {
				set: function(v) {
					this.setAttribute('max', v);
					this.slider.setAttribute('max', v);
					setValue.call(this, this.value);
				},
				get: function() {
					return this.getAttribute('max');
				}
			},
			step: {
				set: function(v) {
					this.setAttribute('step', v);
					this.slider.setAttribute('step', v);
					setValue.call(this, this.value);
				},
				get: function() {
					return this.getAttribute('step');
				}
			},

		}
	});

}

module.exports = {
	register: register
};
