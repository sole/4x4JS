var Effect = require('./Effect');

var EffectClear = function ( renderer ) {

	Effect.call( this );

	// All this effect does is clearing the renderer. Dull, huh!?
	this.update = function ( time ) {
		renderer.clear();
	};

};

EffectClear.prototype = new Effect();
EffectClear.prototype.constructor = EffectClear;

module.exports = EffectClear;
