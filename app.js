var express = require('express');
var bodyParser = require('body-parser');
var queryString = require('querystring');
var request = require('request');
var yo = require('./yo');

var app = express();

app.use(bodyParser.json());

var users = new Array();

/* routes */
app.get('/', function(req, res){ //root route
	res.sendfile("./public/views/register.html");
});

app.post('/register', function(req, res){ 
	var user = { 
		name : req.body.username,
		symbol : req.body.symbol, 
		price : req.body.price
	}; 
	users.push(user);
	var registration = { 
		'registration': 'success'
	}
	res.json(registration);
});

/* static routes */
app.get('/public/stylesheets/global.css', function(req, res){ // stylesheet route
	res.sendfile("./public/stylesheets/global.css");
});

app.get('/public/stylesheets/reset.css', function(req, res){ // stylesheet route
	res.sendfile("./public/stylesheets/reset.css");
});

app.get('/public/scripts/register.js', function(req, res){
	res.sendfile("./public/scripts/register.js");
});

/* App check against yahoo's API every second */
setInterval(function (){ 
	for(user in users){
		console.log(users);

		var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20%3D%20%27"+users[user].symbol+"%27%3B&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		request.get(url, function(err, response, body){ 
			var jbody = JSON.parse(body);
			var lastPrice = Number(jbody.query.results.quote.LastTradePriceOnly);
			if(users[user]  && lastPrice == users[user].price){ 
				console.log("FOUND A MATCH-- YO! :: " + users[user].name);
				yo.yo(users[user].name); //send a yo to that user
				users.splice(user, 1);
				return;
			}
		});
		
		continue;
	}
}, 1000);

/* port */
var port = Number(process.env.PORT || 5000);

/* listen to that port */
app.listen(port);
console.log("Listening on port: " + port);
