const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//helpers utils
const { generateMessage, generateGeoLocMessage } = require('./utils/message');

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
  socket.emit(
    'createNewMessage',
    generateMessage('Admin', 'Welcome to Chatty Chatty Bing Bing')
  );
  // broadcast to others that there's a new user connected.
  socket.broadcast.emit(
    'createNewMessage',
    generateMessage('Admin', 'New chatter ready to bing.')
  );

  //from server to client
  socket.on('createNewMessage', (msg, cb) => {
    console.log('createNewMessage received from client', msg);
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
