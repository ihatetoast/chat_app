var socket = io();
var $ = jQuery;
socket.on('connect', function() {
  console.log('weet woo. connected to server');
});
socket.on('disconnect', function() {
  console.log('boo hoo. disconnected from server');
});

/************************************** */
//     LISTENING FOR SERVER
/************************************** */
socket.on('createNewMessage', function(newMessage) {
  console.log('new message received from server', newMessage);
  const li = $('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);
  $('#messages-list').prepend(li);
});

socket.on('createGeoLocMessage', function(geoMsg) {
  console.log(geoMsg);
  const li = $('<li></li>');
  const a = $(
    '<a target="_blank" rel="noopener noreferrer">Where I\'m binging</a>'
  );
  li.text(`${geoMsg.from}: `);
  a.attr('href', geoMsg.url);
  li.append(a);
  $('#messages-list').prepend(li);
});
/************************************** */
//        EMIT CHAT FROM FORM:
/************************************** */
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

/************************************** */
//        SEND GEO LOCATION
/************************************** */
const geoLocBtn = $('#sendGeoLoc');
geoLocBtn.on('click', function() {
  // console.log('button booped');

  if (!navigator.geolocation) {
    return alert(
      `Honestly. it's ${new Date().getFullYear()}. Update your bloody browser, you sandworm. Because you are on grandpa's computer, your browser does not support geolocation.`
    );
  }
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      // console.log(`Lat: ${pos.coords.latitude}
      // Lon: ${pos.coords.longitude}`);
      socket.emit('sendGeoLocation', {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      });
    },
    function(err) {
      alert('Unable to fetch location.');
    }
  );
});
