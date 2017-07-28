var page = require('page');
var empty = require('empty-element');
var template = require('./template'); //get what module.exports return at the template.js file
var title = require('title');
var header = require('../header');
var Webcam = require('webcamjs');
var pictureCard = require('../picture-card');
var utils = require('../utils');

/*HTTP Clients*/
var request = require('superagent');
var axios = require('axios');

page('/', utils.loadAuth, header, loading, asyncLoad, function (ctx,next)
{
	title('PlatziGram');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template(ctx.pictures));

	const picturePreview = $('#picture-preview');
	const camaraInput = $('#camara-input');
	const cancelPicture = $('#cancelPicture');
	const shootButton = $('#shoot');
	const uploadButton = $('#uploadButton');

	function reset()
	{
			picturePreview.addClass('hide');
			cancelPicture.addClass('hide');
			uploadButton.addClass('hide');
			shootButton.removeClass('hide');
			camaraInput.removeClass('hide');
	}

	cancelPicture.click(reset);

	$('.modal').modal(
		{
		ready: function(modal, trigger)
				{ // Callback for Modal open. Modal and trigger parameters available.
					Webcam.set({
						width: 320,
						height: 240
					});
        			Webcam.attach('#camara-input');
        			shootButton.click( (ev) => {


							Webcam.snap( (data_uri) => {
								picturePreview.html('<img src="'+data_uri+'"/>');
								picturePreview.removeClass('hide');
								cancelPicture.removeClass('hide');
								uploadButton.removeClass('hide');
								shootButton.addClass('hide');
								camaraInput.addClass('hide');
								uploadButton.off('click'); //we use this to clean all the previous click functions and avoid a stack of the same next function again and again
								uploadButton.click(() => {
									const pic = {
										url:data_uri,
										liked:false,
										likes:0,
										createdAt : +new Date(),
										user:{
											username:'slifszyc',
											avatar:'https://materiell.com/wp-content/uploads/2015/03/john-full.png'
											}
									};

									$('#picture-cards').prepend(pictureCard(pic));
									reset();
									$('#modalcamara').modal('close');

								});
							} );


        			} );
        		},
      	complete: function()
      			{
      				Webcam.reset();
      				reset();
      			} // Callback for Modal close
    	}
	);
});

function loading(ctx,next)
{
	var el = document.createElement('div');
	el.classList.add('loader');
	document.getElementById('main-container').appendChild(el);	//this instrucction injects the loader div element and in next middleware in the instruction "empty" the loader div is removed
	next();
}

function loadPicturesWithSuperAgent (ctx,next)
{
	request
		.get('/api/pictures')
		.end(function (err,res){
			if (err) return console.log(err);

			ctx.pictures = res.body;
			next();
		});
}

function loadPicturesWithAxios (ctx,next)
{
	axios
		.get('/api/pictures')
		.then(function (res){
			ctx.pictures = res.data;
			next();
		})
		.catch(function (err){
			console.log(err);
		});
}

function loadPïcturesWithFetch(ctx,next)
{

fetch('/api/pictures')
	 .then(function (res){
	 	return res.json(); /*before processing any data, fetchJS requires to manipulate data so to convert it in json by means of this first promise function*/
	 })
	 .then(function (pictures){
	 	ctx.pictures = pictures;
	 	next();
	 })
	.catch(function (err){
		console.log(err);
	});
}

async function asyncLoad (ctx,next){
	try	{
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());
	 	next();
	}
	catch (err){

	}
}