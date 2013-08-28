function register() {
	var template = 'portamento';

	xtag.register('gear-bajotron', {
		lifecycle: {
			created: function() {
				this.innerHTML = template;
			},
		},
		methods: {
			attachTo: function(bajotron) {
				console.log('gear-bajotron attaching to', bajotron);
			}
		}
	});

}

module.exports = {
	register: register
};

