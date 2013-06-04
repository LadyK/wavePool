var width = 1280;
var height = 720;

$(document).ready(function(){


	$('#mask').css("width",width).css("height",height);
var context;
var oscillators = [];
window.addEventListener('load', init, false);

function addOscillator(id, frequency){
	var oscillator; 
	oscillator = context.createOscillator(); 
	oscillator.connect(context.destination);
	oscillator.frequency.value=frequency;
	oscillator.start(0);
	oscillators[id] = oscillator; 
}

function changeOscillator(id, frequency){
	oscillators[id].frequency.value=frequency;
}

function removeOscillator(id){
	oscillators[id].stop(0);
	oscillators[id]=null;
}

function init() {
  	try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();

    addOscillator('alpha',0);
    addOscillator('beta',0);
    }
  	catch(e) {
    	alert('Web Audio API is not supported in this browser');
  	}
}

$( "#slider-alpha" ).slider({
	min:0,
	max:40000,
	value:0,
	slide: function( event, ui ) {
		changeOscillator('alpha',ui.value);
	}
});

var c=document.getElementById("stageCanvas");
var ctx=c.getContext("2d");
ctx.lineWidth = .5;

var frequency = 0;

$('.anImage').hide();

function everyFrame(){

frequency = $('#slider-alpha').slider("value");
var waveLength = 343/frequency;
var pixelsPerMeter = 150;
var pixelsPerCycle = pixelsPerMeter * waveLength;
var degreePerPixel = 360.0 / pixelsPerCycle;
//console.log(pixelsPerCycle);


ctx.fillStyle = 'rgba(255, 255, 255, .1)';
ctx.clearRect (0, 0, width, height);
var sinePrev = 0;
for (var i=0; i<width;i++){
	var theta = degreePerPixel * i;
	ctx.beginPath();
	ctx.moveTo(i,0);
    	ctx.lineTo(i,height);
	ctx.closePath();
	var sine = Math.sin(theta*Math.PI/180.0);
	var alpha = 0.5+0.5*sine;
	ctx.strokeStyle = 'rgba(0, 0, 0, '+alpha+')';
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(i,20+10*sine);
    	ctx.lineTo(i-1,20+10*sinePrev);
	ctx.closePath();
	ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
	ctx.stroke();
	sinePrev = sine;
}


var actorsToShow = $('.anImage[data-active="false"]').filter(function (index) {
			return frequency > $(this).attr('data-startFrequency') && frequency < $(this).attr('data-endFrequency');
		});
		actorsToShow.attr('data-active','true').css('opacity','0.01').show().animate({opacity:'1'},500);

		var actorsToHide = $('.anImage[data-active="true"]').filter(function (index) {
			return frequency < $(this).attr('data-startFrequency') || frequency > $(this).attr('data-endFrequency');
		});
		actorsToHide.attr('data-active','false').animate({opacity:'0'},250,function(){$(this).hide();});	


}
setInterval(everyFrame,100);



});