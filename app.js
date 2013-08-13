var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

var express = require('express');
var app = express();

var port = process.env.PORT || nconf.get('port');
var oscServerPort = nconf.get('oscServerPort');
console.log('Web server at', port);
console.log('OSC server at', oscServerPort);

var configurations = module.exports;
var settings = require('./settings')(app, configurations, express);
var server = require('http').createServer(app);
var osc = require('node-osc');
var io = require('socket.io').listen(server);


/* Filters for routes */

var routeFiltering = function(req, res, next) {
	// Not really filtering
	next();
};

// Routes
require('./routes')(app, routeFiltering);


// Rebuild song each time the server is fired up
var Renoise = require('renoise');
var Orxatron = require('./public/js/Orxatron'); // TODO change this path when moving Orxatron into its own module
var pd = require('pretty-data').pd;
var fs = require('fs');
var dstSong = './public/build/data/song.json';

	
Renoise.loadAsJSON('./data/song.xrns', function(songJSON) {
	// fs.writeFileSync('tatatata.json', pd.json(songJSON));
	
	var convertedSong = Orxatron.DataUtils.renoiseToOrxatron(songJSON);
	fs.writeFileSync(dstSong, JSON.stringify(convertedSong, null, '\t'));

});



// OSC
var oscServer = new osc.Server(oscServerPort, '0.0.0.0');

// Socket.io
var lastSocket = null;
io.sockets.on('connection', function (socket) {
	lastSocket = socket;
});

oscServer.on('message', function(msg, rinfo) {
	console.log('mes', msg);

	if(lastSocket) {
		lastSocket.emit('osc', msg);
	}
});


// c'est fini
server.listen(port);
