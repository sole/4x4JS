var SequencerItem = require('./Sequencer').SequencerItem;

var Effect = function( renderer ) { };
Effect.prototype = Object.create( SequencerItem.prototype );

Effect.prototype.processEvents = function( startTime, endTime, eventsList ) {
	console.log('processing events', startTime, endTime);
};

Effect.prototype.setSize = function( width, height ) {
};

module.exports = Effect;
