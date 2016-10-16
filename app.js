var express = require('express');
var path = require('path');
var mongodb = require('mongodb');
var request = require('request');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var database;
var yandexKey = "trnsl.1.1.20161016T131327Z.c29678f165de73dc.9852d7f36636b6cfeed8579cef0b0739a848fdf6";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use('/', routes);
app.use('/users', users);
app.use(express.static(path.join(__dirname, 'public')));




//Database connection

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/translate_db';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
	  
    console.log('Connection established to', url);
	database = db;
	
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});

  }
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/index.html', function (req, res) {
  res.render('index');
});

app.post('/translate', function (req, res) {
	console.log("Let's translate");
	if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
			var jsonObject = JSON.parse(jsonString);
			console.log(jsonObject);
            var translated_texts = database.collection('translated_texts');
			if(jsonObject != undefined){
				translated_texts.findOne(jsonObject,  function(err, texts){
					if(texts){
						
						if(texts) {
							console.log(texts);
							res.send(
								(err === null) ? { msg: texts.translated_text } : { msg: err }
							);
						 }
						 else {
							res.end();
						}
						
					}else {
						console.log("Translated with yandex");
						// the post options
						var pathYandex  =  '/api/v1.5/tr.json/translate?key=' + yandexKey;
						pathYandex += "&text=" + jsonObject.text + "&lang=" + jsonObject.from_language + "-" + jsonObject.to_language 
						var optionspost = {
							url : 'https://translate.yandex.net' + pathYandex,
							json : true,
							body : JSON.stringify({text : jsonObject.text}),
							method:'POST'
						};
						request(optionspost, function (error, response, body) {
							
							if (!error && response.statusCode == 200) {
								jsonObject.translated_text = body.text[0];
								//insert yandex
								translated_texts.insert(jsonObject, function(err, docs){
									if (err) return console.log(err)
									console.log('saved to database');
									res.send(
										(err === null) ? { msg: jsonObject.translated_text } : { msg: err }
									);
								});
							 }
						})
						
					}
				});
			} else {
				console.log("Request is empty !!");
			}
        });
    }
});




module.exports = app;




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


