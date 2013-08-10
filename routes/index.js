module.exports = function (app, routeFiltering) {

	'use strict';

	app.get('/', function (req, res) {
		res.render('index');
	});

	app.get('/gui', function (req, res) {
		res.render('gui');
	});

	app.get('/client', function (req, res) {
		res.render('client');
	});

	// API
	app.get('/api/gear.json', function(req, res) {
		// TODO Actually scan the gear directory
		res.json({ 
			sorotron: 'something',
			spx90: 'something else'
		});
	});

};
