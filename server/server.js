const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateGeoLocMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log("weet woo. noo foo' connected");

  //handle joining rooms:
  socket.on('join', (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      cb('Handle and room are required.');
    }
    socket.join(params.room);
    // io.emit becomes io.to('astring').emit
    // socket.broadcast.emit becomes socket.broadcast.to('string').emit
    // socket.emit does not change

    // upon connecting ...
    // create a message from the admin to the newly cx user to welcome.
    socket.emit(
      'createNewMessage',
      generateMessage('Admin', 'Welcome to Chatty Chatty Bing Bing')
    );

    // broadcast to others i the room that there's a new user connected.
    socket.broadcast
      .to(params.room)
      .emit(
        'createNewMessage',
        generateMessage('Admin', `${params.name} has joined ${params.room}`)
      );
    cb();
  });
  //from server to client
  socket.on('createNewMessage', (msg, cb) => {
    // console.log('createNewMessage received from client', msg);
    io.emit('createNewMessage', generateMessage(msg.from, msg.text));
    cb();
  });

  socket.on('sendGeoLocation', coords => {
    io.emit(
      'createGeoLocMessage',
      generateGeoLocMessage('Admin', coords.lat, coords.long)
    );
  });
  socket.on('disconnect', () => {
    console.log("boo hoo. foo' went to the loo.");
  });
}); //end io.on

server.listen(port, () => {
  console.log(`Chatty McChatterson is calling you on extension ${port}`);
});
