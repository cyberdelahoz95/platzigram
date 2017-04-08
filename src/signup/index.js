var page = require('page');
var empty = require('empty-element');
var template = require('./template'); //get what module.exports return at the template.js file
var title = require('title');

var main = document.getElementById('main-container');

page('/signup',function (ctx,next){
	title('PlatziGram - Regístrate');
	empty(main).appendChild(template);
});