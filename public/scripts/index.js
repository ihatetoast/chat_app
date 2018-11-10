var socket = io();
var $ = jQuery;
socket.on('connect', function() {
  console.log('weet woo. connected to server');
});
socket.on('disconnect', function() {
  console.log('boo hoo. disconnected from server');
});

socket.on('createNewMessage', function(newMessage) {
  console.log('new message received from server', newMessage);
  const li = $('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);
  $('#messages-list').prepend(li);
});

$('#chat-form').on('submit', function(e) {
  e.preventDefault();
  //call socket.emit
  socket.emit(
    'createNewMessage',
    {
      from: 'Anonymous Binger',
      text: $('[name=message]').val()
    },
    function(data) {
      console.log(data);
    }
  );
});
