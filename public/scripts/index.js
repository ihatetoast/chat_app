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
  // console.log('new message received from server', newMessage);
  const formattedTimestamp = moment(newMessage.createdAt).format('h:mm a');
  const li = $('<li></li>');
  li.text(`${newMessage.from} ${formattedTimestamp}: ${newMessage.text}`);
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
  const messageField = $('[name=message]');
  //call socket.emit
  socket.emit(
    'createNewMessage',
    {
      from: 'Anonymous Binger',
      text: messageField.val()
    },
    function(data) {
      messageField.val('');
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
  geoLocBtn.attr('disabled', 'disabled').text('Big brother looking...');
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      // console.log(`Lat: ${pos.coords.latitude}
      // Lon: ${pos.coords.longitude}`);
      geoLocBtn.removeAttr('disabled').text('Stalk me');
      socket.emit('sendGeoLocation', {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      });
    },
    function(err) {
      geoLocBtn.removeAttr('disabled').text('Stalk me');
      alert('Unable to fetch location.');
    }
  );
});
