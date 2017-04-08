var express = require('express');
var app = express();
var multer  = require('multer');
var ext = require('file-extension');

var aws = require('aws-sdk');

var multerS3 = require('multer-s3');

var config = require('./config');

var s3 = new aws.S3({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretAccessKey,
})

var storage = multerS3({
				s3:s3,
				bucket:'platzigram-henry',
				acl: 'public-read',
				metadata: function(req,file,cb){
					cb(null,{fieldName:file.fieldname})
				},
				key:function(req,file,cb){
					 cb(null, +Date.now()+'.'+ext(file.originalname)); 
				}
})



var upload = multer({ storage: storage }).single('picture'); /*picture is the input file name that came from client's form*/

app.set('view engine','pug');

app.use(express.static('public')); //this instrucion transforms public into a virtual folder, no need to set  path in views file source attributes, its enough just by typing the name of the file we want to look for , and express is going to find such file in every virtual folder we set by means of this instruction. in template engines files such as pug it is good tough to use the / symbol so to give the absolute path of the virtual public folder, this is a good practice because if the route is a extense route (for example www.example.com/1/2) files are not going to be found if we use relative path (for example www.example.com/1/app.js) instead if we use absolute path (f.e. www.example.com/app.js) there wont be any kind of problem.

app.get('/', function(req,res){
	res.render('index',{ 'title':'Welcome To PlatziGram' });
	//res.send('hola mundo');
});

app.get('/signup', function(req,res){
	res.render('index',{ 'title':'PlatziGram - Regístrate' });
	//res.send('hola mundo');
});

app.get('/signin', function(req,res){
	res.render('index',{ 'title':'PlatziGram - Inicia Sesión' });
	//res.send('hola mundo');
});


app.get('/api/pictures',function(req, res){

	
	var pictures = [
		{
			user:{
				username:'slifszyc',
				avatar:'https://materiell.com/wp-content/uploads/2015/03/john-full.png'
			},
			url:'office.jpg',
			likes:10,
			liked:false,
			createdAt:	new Date().getTime()
		},
		{
			user:{
				username:'cyberdelahoz95',
				avatar:'https://materiell.com/wp-content/uploads/2015/03/doug_full1.png'
			},
			url:'office.jpg',
			likes:2,
			liked:false,
			createdAt: new Date().setDate(new Date().getDate()-10)	
		}		
	];

setTimeout(function (){
	res.send(pictures);
},2000);

	

});

app.post('/api/pictures',function (req,res){
	upload(req,res, function(err)
					{
						if (err)
						 {
						 	return res.status(500).send(err);
						 }
						 return res.send('File uploaded');
					});
});

app.get('/api/user/:username', function(req,res){	
	const user =
	 {
	 	username: req.params.username,
	 	avatar: 'http://www.luigix.com/wp-content/uploads/luigix_manga.jpg',
	 	pictures : [
				 	{
						id:	1,
						src: 'https://scontent.fbaq1-1.fna.fbcdn.net/v/t1.0-9/17523240_1364091930326001_7067621866624922243_n.png?oh=24a478a46103c1bf9beaf098ce3d977e&oe=5960A252',
						likes:	3 		
				 	},
				 	{
				 		id:2,
				 		src: 'https://scontent.fbaq1-1.fna.fbcdn.net/v/t1.0-9/17098597_1337065839695277_7064680090356692852_n.png?oh=a8b3f17b423288cb7115a52efa1dbb44&oe=59697012',
				 		likes:10
				 	},
					{
				 		id:3,
				 		src: 'https://scontent.fbaq1-1.fna.fbcdn.net/v/t1.0-9/16865165_1336190849782776_7602146400375590186_n.jpg?oh=e4f888b88d116bcd2ff742c8dbcfbad5&oe=5958E858',
				 		likes:0
				 	}				 	
	 	]
	 };
	 res.send(user);
});

app.get('/:username',function (req,res)
{
	res.render('index',{title:`PlatziGram - ${req.params.username}`});
});

app.get('/:username/:id',function (req,res)
{
	res.render('index',{title:`PlatziGram - ${req.params.username}`});
});

app.listen(3000,function(err){
	if (err)	return console.log("hubo un error"), process.exit(1);

	console.log("PlatziGram Escuchando en el puerto 3000");
});
