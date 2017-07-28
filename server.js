var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var config = require('./config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var port = process.env.PORT || 5050;
var passport = require('passport');
var platzigram = require('platzigram-client');
var auth = require('./auth');

var client = platzigram.createClient(config.client);

var s3 = new aws.S3({
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretAccessKey,
});

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

var app = express();
app.set(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(expressSession({
	secret: config.secret,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())

app.set('view engine','pug');

app.use(express.static('public')); //this instrucion transforms public into a virtual folder, no need to set  path in views file source attributes, its enough just by typing the name of the file we want to look for , and express is going to find such file in every virtual folder we set by means of this instruction. in template engines files such as pug it is good tough to use the / symbol so to give the absolute path of the virtual public folder, this is a good practice because if the route is a extense route (for example www.example.com/1/2) files are not going to be found if we use relative path (for example www.example.com/1/app.js) instead if we use absolute path (f.e. www.example.com/app.js) there wont be any kind of problem.

passport.use(auth.localStrategy);
passport.use(auth.facebookStrategy);
passport.deserializeUser(auth.deserializeUser);
passport.serializeUser(auth.serializeUser);

app.get('/', function(req,res){
	res.render('index',{ 'title':'Welcome To PlatziGram' });
	//res.send('hola mundo');
});

app.get('/signup', function(req,res){
	res.render('index',{ 'title':'PlatziGram - Regístrate' });
	//res.send('hola mundo');
});

app.post('/signup', function(req,res){
  var user = req.body;
  client.saveUser(user, function (err,usr){
	  if (err) return res.status(500).send(err.message);

	  res.redirect('/signin');
  })
});

app.get('/signin', function(req,res){
	res.render('index',{ 'title':'PlatziGram - Inicia Sesión' });
	//res.send('hola mundo');
});

app.post('/login', passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect:'/signin'
}));

app.get('/logout', function(req,res){
	req.logout();

	res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook',{
	scope: 'email'
}))

app.get('/auth/facebook/callback', passport.authenticate('facebook',{
	successRedirect: '/',
	failureRedirect:'/signin'
}))

function ensureAuth (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.status(401).send({error: 'not authenticated'})
}

app.get('/whoami', function(req, res){
	if (req.isAuthenticated()) {
		return res.json(req.user);
	}

	res.json({auth:false});
});

app.get('/api/pictures',function(req, res){
	client.listPictures(function (err, pictures) {
		if(err) return res.send([]);

		res.send(pictures);
	})
});

app.post('/api/pictures',ensureAuth,function (req,res){
	upload(req,res, function(err)
					{
						if (err)
						 {
						 	return res.status(500).send(err);
						 }

						 var user = req.user;
						 var token = req.user.token;
						 var username = req.user.username;
						 var src = req.file.location; // estos atributos relacionados con el archivo a subir son inyectados por el moduleo multer s3

						 console.log(user)

						 client.savePicture({
							 src: src,
							  userId: username,
							  user: {
								username: username,
								avatar: user.avatar,
								name: user.name
							  }
						 }, token, function (err, img) {
							 if(err) res.status(500).send(err);

							 return res.send(`File uploaded: ${req.file.location}`);
						 });


					});
});

app.get('/api/user/:username', function(req,res){
	var username = req.params.username;
	client.getUser(username, function (err, user) {
		if (err) return res.status(404).send({ error: 'user not found'})

		res.send(user);
	});
});

app.get('/:username',function (req,res)
{
	res.render('index',{title:`PlatziGram - ${req.params.username}`});
});

app.get('/:username/:id',function (req,res)
{
	res.render('index',{title:`PlatziGram - ${req.params.username}`});
});

app.listen(port,function(err){
	if (err)	return console.log("hubo un error"), process.exit(1);

	console.log("PlatziGram Escuchando en el puerto "+port);
});
