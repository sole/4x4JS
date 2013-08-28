function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	var that = this;

	setParams({
		attack: attack,
		decay: decay,
		sustain: sustain,
		release: release
	});


	//


	function setParams(params) {
		that.attack = params.attack !== undefined ? params.attack : 0.0;
		that.decay = params.decay !== undefined ? params.decay : 0.02;
		that.sustain = params.sustain !== undefined ? params.sustain : 0.5;
		that.release = params.release !== undefined ? params.release : 0.10;
	}
	
	// ~~~
	
	this.setParams = setParams;

	this.beginAttack = function(when) {
		when = when !== undefined ? when : 0;
		
		var now = when;

		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		
		when = when !== undefined ? when : 0;
		var now = when;

		param.cancelScheduledValues(now);
		param.linearRampToValueAtTime(0, now + this.release);
		param.setValueAtTime(0, now + this.release + 0.001);
	};

}

module.exports = ADSR;
