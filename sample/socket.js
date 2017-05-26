//npm install socket.io socket.io-client

  var express = require('express');
  var app = express();
  app.get([/\/$/, /.*\.html$/], function (req, res) {
    var filename = __dirname + req.path;
    filename += filename.endsWith('/')? 'index.html': '';
    fs.readFile(filename, function (_, data) {
      res.send(data
      + '<script src="/node_modules/socket.io-client/socket.io.js"></script>'
      + '<script>'
      + '  var socket = io();'
      + '  socket.on("file-change-event", function () {'
      + '    window.location.reload();'
      + '  });'
      + '</script>'
      );
    });
  });
  app.use(express.static(__dirname));

  var http = require('http').Server(app);
  http.listen(8080);

  var fs = require('fs');
  var io = require('socket.io')(http);
  fs.watch(__dirname, { recursive:true }, function () {
    io.emit('file-change-event');
  });