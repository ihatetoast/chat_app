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
  socket.emit('newEmail', {
    from: 'georgia@hardstarking.com',
    text: 'Stay sexy and ...',
    createdAt: 123
  });
  socket.emit('newMessage', {
    from: 'elvis@cookie.org',
    text: 'Hellsyeah, I want a cookie. Hand it over!'
  });
  socket.on('createNewEmail', newEmail => {
    console.log('createNewEmail  received from client', newEmail);
  });
  socket.on('createNewMessage', newMessage => {
    console.log('createNewMessage received from client', newMessage);
  });
  socket.on('disconnect', () => {
    console.log("boo hoo. foo' went to the loo.");
  });
}); //end io.on

server.listen(port, () => {
  console.log('Chatty McChatterson is calling you on extension', port);
});
