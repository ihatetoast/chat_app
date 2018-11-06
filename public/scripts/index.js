var socket = io();
socket.on('connect', function() {
  console.log('weet woo. connected to server');
});
socket.on('disconnect', function() {
  console.log('boo hoo. disconnected from server');
});

socket.on('newMessage', function(newMessage) {
  console.log('new message received from server', newMessage);
});
