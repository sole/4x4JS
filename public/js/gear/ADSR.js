function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	this.attack = attack;
	this.decay = decay;
	this.sustain = sustain;
	this.release = release;

	// ~~~
	
	this.beginAttack = function(when) {
		when = when !== undefined ? when : 0;
		var now = audioContext.currentTime + when;
		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		when = when !== undefined ? when : 0;
		var now = audioContext.currentTime + when;
		param.cancelScheduledValues(now);
		param.linearRampToValueAtTime(0, now + this.release);
		param.setValueAtTime(0, now + this.release + 0.001);
	};

}

module.exports = ADSR;
