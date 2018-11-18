"use strict";

var socket = io();
var $ = jQuery;
socket.on('connect', function () {
  console.log('weet woo. connected to server');
});
socket.on('disconnect', function () {
  console.log('boo hoo. disconnected from server');
});
/************************************** */
//     LISTENING FOR SERVER

/************************************** */

socket.on('createNewMessage', function (newMessage) {
  var formattedTimestamp = moment(newMessage.createdAt).format('h:mm a');
  var template = $('#msg-template').html();
  var html = Mustache.render(template, {
    text: newMessage.text,
    from: newMessage.from,
    createdAt: formattedTimestamp
  });
  $('#messages-list').prepend(html);
});
socket.on('createGeoLocMessage', function (geoMsg) {
  var formattedTimestamp = moment(geoMsg.createdAt).format('h:mm a');
  var template = $('#geoLoc-template').html();
  var html = Mustache.render(template, {
    url: geoMsg.url,
    createdAt: formattedTimestamp
  });
  $('#messages-list').prepend(html);
});
/************************************** */
//        EMIT CHAT FROM FORM:

/************************************** */

$('#chat-form').on('submit', function (e) {
  e.preventDefault();
  var messageField = $('[name=message]'); //call socket.emit

  socket.emit('createNewMessage', {
    from: 'Anonymous Binger',
    text: messageField.val()
  }, function (data) {
    messageField.val('');
  });
});
/************************************** */
//        SEND GEO LOCATION

/************************************** */

var geoLocBtn = $('#sendGeoLoc');
geoLocBtn.on('click', function () {
  // console.log('button booped');
  if (!navigator.geolocation) {
    return alert("Honestly. it's ".concat(new Date().getFullYear(), ". Update your bloody browser, you sandworm. Because you are on grandpa's computer, your browser does not support geolocation."));
  }

  geoLocBtn.attr('disabled', 'disabled').text('Big brother looking...');
  navigator.geolocation.getCurrentPosition(function (pos) {
    // console.log(`Lat: ${pos.coords.latitude}
    // Lon: ${pos.coords.longitude}`);
    geoLocBtn.removeAttr('disabled').text('Stalk me');
    socket.emit('sendGeoLocation', {
      lat: pos.coords.latitude,
      long: pos.coords.longitude
    });
  }, function (err) {
    geoLocBtn.removeAttr('disabled').text('Stalk me');
    alert('Unable to fetch location.');
  });
});