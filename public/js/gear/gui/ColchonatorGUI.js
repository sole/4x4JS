var template = '<header>Colchonator</header><div class="numVoicesContainer"></div>' + 
	'<div class="reverbContainer"></div>' +
	'<div class="adsrContainer"></div>' +
	'<div class="noiseContainer"></div>';


function register() {
	xtag.register('gear-colchonator', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;

				this.numVoicesContainer = this.querySelector('.numVoicesContainer');
				this.numVoices = document.createElement('gear-slider');
				this.numVoices.label = 'num voices';
				this.numVoices.min = 1;
				this.numVoices.max = 10;
				this.numVoices.step = 1;
				this.numVoices.value = 1;
				this.numVoicesContainer.appendChild(this.numVoices);

				this.reverbContainer = this.querySelector('.reverbContainer');
				this.reverb = document.createElement('gear-reverbetron');
				this.reverbContainer.appendChild(this.reverb);

				this.adsrContainer = this.querySelector('.adsrContainer');
				this.adsr = document.createElement('gear-adsr');
				this.adsrContainer.appendChild(this.adsr);

				this.noiseContainer = this.querySelector('.noiseContainer');
				this.noise = document.createElement('gear-noise-generator');
				this.noiseContainer.appendChild(this.noise);


			}
		},
		methods: {

			attachTo: function(colchonator) {
				var that = this;

				this.colchonator = colchonator;

				this.numVoices.attachToObject(colchonator, 'numVoices', function() {
					console.log('num voices changed', that.numVoices.value);
				}, 'num_voices_change', function() {
					console.log('colchonator num voices changed', colchonator.numVoices);
				});

				// reverb settings/gui
				this.reverb.attachTo(colchonator.reverb);

				// voice ADSR

				// noise
				this.noise.attachTo(colchonator.noiseGenerator);

			},

			detach: function() {
				//this.voice.removeEventListener('octave_change', this.octaveChangeListener, false);
				//this.voice.removeEventListener('wave_type_change', this.waveTypeChangeListener, false);
			}

		}
	});
}

module.exports = {
	register: register
};
