// Simulates a mosaic server.
//
// /             serves mosaic.html
// /js/*         servers static files
// /color/<hex>  generates a tile for the color <hex>
//
var mosaic = require('./js/mosaic.js');
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var util = require('util');

var dir = path.dirname(fs.realpathSync(__filename));
var svgTemplate = [
  '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">',
    '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>',
  '</svg>'
].join('');

http.createServer(function (req, res) { 
  var pathname = url.parse(req.url).pathname;
  var m;
  if (pathname == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(dir + '/mosaic.html').pipe(res);
    return;
  } else if (m = pathname.match(/^\/js\//)) {
    var filename = dir + pathname;
    var stats = fs.existsSync(filename) && fs.statSync(filename);
    if (stats && stats.isFile()) {
      res.writeHead(200, {'Content-Type' : 'application/javascript'});
      fs.createReadStream(filename).pipe(res);
      return;
    }
  } else if (m = pathname.match(/^\/color\/([0-9a-fA-F]{6})/)) {
    res.writeHead(200, {'Content-Type': 'image/svg+xml'});
    res.write(util.format(svgTemplate, mosaic.TILE_WIDTH, mosaic.TILE_HEIGHT, m[1]));
    res.end();
    return;
  }
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('404 Not Found\n');
  res.end();
}).listen(8765, 'localhost');

console.log('mosaic server running on port 8765');
