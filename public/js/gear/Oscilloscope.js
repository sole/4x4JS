function Oscilloscope(audioContext, options) {
	
	'use strict';

	var canvasWidth = 200;
	var canvasHeight = 100;
	var canvasHalfWidth = canvasWidth * 0.5;
	var canvasHalfHeight = canvasHeight * 0.5;
	var numSlices = 32;
	var inverseNumSlices = 1.0 / numSlices;

	// Graphics
	var container = document.createElement('div');
	var canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	var ctx = canvas.getContext('2d');

	container.appendChild(canvas);

	// and audio
	var processor = audioContext.createScriptProcessor(2048);
	var bufferLength = processor.bufferSize;

	console.log('buffer length oscilloscope', bufferLength);
	console.log('tutu', canvas, container);

	processor.onaudioprocess = updateDisplay;

	//
	
	function updateDisplay(evt) {
		
		var buffer = evt.inputBuffer,
			bufferLeft = buffer.getChannelData(0),
			bufferRight = buffer.getChannelData(1),
			numSamples = bufferLeft.length,
			sliceWidth = canvasWidth / numSlices;

		var sliceSize = Math.round(numSamples * inverseNumSlices),
			index = 0;

			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);

			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgb(0, 255, 0)';

			ctx.beginPath();

			var x = 0;

			for(var i = 0; i < numSlices; i++) {
				index += sliceSize ;

				if(index > numSamples) {
					break;
				}

				var v = (bufferLeft[index] + bufferRight[index]) * 0.5,
					y = canvasHalfHeight + v * canvasHalfHeight; // relative to canvas size. Originally it's -1..1

				if(i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			ctx.lineTo(canvasWidth, canvasHalfHeight);

			ctx.stroke();

	}

	// ~~~
	
	this.input = processor;
	this.output = processor;
	this.domElement = container;

}

module.exports = Oscilloscope;
