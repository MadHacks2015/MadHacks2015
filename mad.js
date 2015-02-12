var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
try{
	global.keys = require("./keys.json");
}catch( e ){
	console.log("You most likely don't have the 'keys.json', get it from the shared google drive folder");
	return;
}
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var file = __dirname + "/db.sqlite";
global.path = require('path');
global.nm = require("nodemailer");
var exists = fs.existsSync(file);
if (!exists) {
	fs.openSync(file, "w");
}

global.db = new sqlite3.Database(file);
global.sqler = require('sqler');

if (!exists) {
	console.log("creating new db");
	db.serialize(function () {

		sqler.createApplications(function(err){
			if(err) console.log(err);
		});
		sqler.createAnon(function(err){
			if(err) console.log(err);
		});
		db.run('CREATE TABLE "subscriptions" (	"email" blob PRIMARY KEY NOT NULL, '+
				'"created_at" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP));', function(err){
			if(err) console.log(err);
		});
		db.run('CREATE TABLE "pass_recovery" ("email" BLOB, "token" BLOB PRIMARY KEY	NOT NULL )', function(err){
			if(err) console.log(err);
		});
	});
 }

//setup password encryption
global.bcrypt = require('bcrypt-nodejs');

global.s4 = function() {return Math.floor((1 + Math.random()) * 0x10000).toString(36);};
global.getUser = function(req, success, fail){
	if(req.signedCookies.user){
		db.get('SELECT * FROM users WHERE user_name="'+req.signedCookies.user+'";', function(err, user){
			if(err || !user)
				{console.log(err); fail(err); return;} 
			success(user);
		});
	}else{
		fail({error:"no cookie"});
	}
}


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/img/favicon.png'));
// app.use(sqlinjection);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cookieParser(keys.secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());

var util = require('util');
var exec = require('child_process').exec;

app.post('/hook', function(req, res) {	
	//pull
	exec('git pull',
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null)
			  console.log('exec error: ' + error);
			else //restart server
				exec('npm install',
					function (error, stdout, stderr) {
						console.log('stdout: ' + stdout);
						console.log('stderr: ' + stderr);
						if (error !== null) 
							console.log('exec error: ' + error);
						else
							exec('forever restart mad.js',
								function (error, stdout, stderr) {
									console.log('stdout: ' + stdout);
									console.log('stderr: ' + stderr);
									if (error !== null) 
										console.log('exec error: ' + error);
									res.send(200, {});
							});
					});
		});
	
});

app.use('/', routes);
app.use('/users', users);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('index', {
			message: err.message,
			error: err
		});
	});
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('index', {
		message: err.message,
		error: {}
	});
});


module.exports = app;

app.listen("4000");

var backup = function(){
	var error = function(err){
		console.log(err);
	}
	var rd = fs.createReadStream("db.sqlite");
	rd.on("error", error);


	var wr = fs.createWriteStream("../madhacksBackups/"+(new Date().getTime())+".sqlite");
	wr.on("error", error);

	rd.pipe(wr);
}
backup();
setInterval(backup, 86400000)