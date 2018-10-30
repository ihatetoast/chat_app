const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log("weet woo. noo foo' connected");

  socket.on('disconnect', () => {
    console.log("boo hoo. foo' went to the loo.");
  });
});

server.listen(port, () => {
  console.log('Chatty McChatterson is calling you on extension', port);
});
