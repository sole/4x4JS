var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

var express = require('express');
var app = express();

var port = process.env.PORT || nconf.get('port');
var oscServerPort = nconf.get('oscServerPort');
var oscClientPort = nconf.get('oscClientPort');
console.log('Web server at', port);
console.log('OSC server at', oscServerPort);
console.log('OSC client at', oscClientPort);

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
	var tatata = 'tatatata.json';
	if(fs.existsSync(tatata)) {
		fs.unlinkSync(tatata);
	}
	// fs.writeFileSync(tatata, pd.json(songJSON));
	
	var convertedSong = Orxatron.DataUtils.renoiseToOrxatron(songJSON);
	fs.writeFileSync(dstSong, JSON.stringify(convertedSong, null, '\t'));

});



// OSC
// Config settings in QuNeoOSC_Bridge
// Osc IN = On
// Input = oscClientPort
// Output to Device = QUNEO
// Maybe - toggle remote LED control
var oscServer = new osc.Server(oscServerPort, '0.0.0.0');
var oscClient = new osc.Client('0.0.0.0', oscClientPort);
//oscClient.send('/quneo/leds/pads/0/SE/red', 1);

// Socket.io
var lastSocket = null;
io.sockets.on('connection', function (socket) {
	lastSocket = socket;

	lastSocket.on('message', function(data) {
		console.log('socket received', data);
		oscClient.send(data[0], data[1]);
	});
});

oscServer.on('message', function(msg, rinfo) {
	console.log('mes', msg);

	if(lastSocket) {
		lastSocket.emit('osc', msg);
	}
});


// c'est fini
server.listen(port);
