var socket = io();
socket.on('connect', function() {
  console.log('weet woo. connected to server');
  //created from client
  socket.emit('createNewEmail', {
    from: 'karen@kilgariff',
    text: "...don't get murdered!"
  });
  socket.emit('createNewMessage', {
    from: 'george@introvertedhound.com',
    message: 'Please respect my privacy and do not add me to the chat group.'
  });
});
socket.on('disconnect', function() {
  console.log('boo hoo. disconnected from server');
});
//from server to client
socket.on('newEmail', function(newEmail) {
  console.log('new email', newEmail);
});
socket.on('newMessage', function(newMessage) {
  console.log('new message received from server', newMessage);
});
