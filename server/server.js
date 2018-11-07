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
  // upon connecting ...
  // create a message from the admin to the newly cx user to welcome.
  socket.emit('createNewMessage', {
    from: 'Admin',
    text: 'Welcome to Chatty Chatty Bing Bing',
    createdAt: new Date().getTime()
  });
  // broadcast to others that there's a new user connected.
  socket.broadcast.emit('createNewMessage', {
    from: 'Admin',
    text: 'A new Binger has joined the chatroom',
    createdAt: new Date().getTime()
  });

  //from server to client
  socket.on('createNewMessage', msg => {
    console.log('createNewMessage received from client', msg);
    // io.emit emits to cxs vs socket, which is one cx.
    // not same as broadcast. bc is for everyone BUT the one client emitting.
    io.emit('newMessage', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //   from: msg.from,
    //   text: msg.text,
    //   createdAt: new Date().getTime()
    // });
  });
  socket.on('disconnect', () => {
    console.log("boo hoo. foo' went to the loo.");
  });
}); //end io.on

server.listen(port, () => {
  console.log('Chatty McChatterson is calling you on extension', port);
});
