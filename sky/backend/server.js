'use strict';

var express     = require('express'),
    fs          = require('fs'),
    app         = express(),
    server      = require('http').createServer(app),
    urlPaths    = ['/register', '/thanks'];

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "ch0pSuey" }));

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

app.use(express.static(__dirname + '/../frontend'));

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("listening on " + port);
});