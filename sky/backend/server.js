'use strict';

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var server = require('http').createServer(app);
var urlPaths = ['/register', '/thanks'];

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "ch0pSuey",
    resave: true,
    saveUninitialized: true    
}));

app.get('/', function (req, res) {
    res.redirect(urlPaths[0]);
});

app.get(urlPaths, function (req, res) {
    res.send(fs.readFileSync(__dirname + '/../frontend/src/index.html').toString());
});

app.post('/rest/register', function (req, res) {
    if(req.body.email === 'foo@bar.com') {
        res.send(403, 'The given e-mail address has been already taken!');
    } else {
        res.send({ success: true });
    }
});

// map static resources
app.use(express.static(__dirname + '../../node_modules/'));
app.use(express.static(__dirname + '../../frontend/'));

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("listening on " + port);
});