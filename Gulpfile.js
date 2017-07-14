var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');


gulp.task('styles',function(){

	gulp
		.src('index.scss')
		.pipe(sass())
		.pipe(rename('app.css'))
		.pipe(gulp.dest('public'));

});

gulp.task('assets',function(){
	gulp
		.src('assets/*') //regular expressions to find files of certain kind
		.pipe(gulp.dest('public'));
});



function compile(watch)
{
	var bundle = browserify('./src/index.js'); /*creates a compile file with all the required modules and function so the file index.js in the path runs properly*/
/*bundle object is the main JS file package file, is a production ready js file that allows to compile, minify and link all the main js modules and plugins related with the project*/

	if (watch) 
	{
		bundle = watchify(bundle); /*watchify function returns the same bundle object but with methods that are executed when events fire such as updating or deleting*/
		bundle.on('update', function (){
			console.log('bundling...');
			rebundle();
		});
	}	

	function rebundle()
	{
		bundle
		.transform(babelify,{presets:["es2015"],plugins:['syntax-async-functions','transform-regenerator']}) //transform es2015 in a readable JS file for those browser who do not support es2015 yet
		.bundle()
		.on('error',function(err){
			console.log(err);
			this.emit('end');
		})
		.pipe(source('index.js')) //source is a function that allows Gulp to continue its process after receiving the result of a browserify task
		.pipe(rename('app.js'))		
		.pipe(gulp.dest('public'));	

	}



	rebundle();
}



gulp.task('build',function (){ return compile(); });

gulp.task('watch',function (){return compile(true);});

gulp.task('default',['styles','assets','build']); //this is the main task invoker, after creating any task we come here and register the sequence of task