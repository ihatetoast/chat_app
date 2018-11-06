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

  //from server to client
  socket.on('createNewMessage', msg => {
    console.log('createNewMessage received from client', msg);
    // io.emit emits to cxs (broadcast) vs socket, which is one cx.
    io.emit('newMessage', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
  });
  socket.on('disconnect', () => {
    console.log("boo hoo. foo' went to the loo.");
  });
}); //end io.on

server.listen(port, () => {
  console.log('Chatty McChatterson is calling you on extension', port);
});
