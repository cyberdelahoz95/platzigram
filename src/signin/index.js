var page = require('page');
var empty = require('empty-element');
var template = require('./template'); //get what module.exports return at the template.js file
var title = require('title');

var main = document.getElementById('main-container');

page('/signin',function (ctx,next){
	title('PlatziGram - Inicia Sesión');	
	empty(main).appendChild(template);
});