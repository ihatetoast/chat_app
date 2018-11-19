"use strict";

var socket = io();
var $ = jQuery;
/**
 *
 * helper fcn to deterimine if we scroll to bottom:
 * height of msg plus height of client >= total scroll height?
 * scroll on
 */

var scrollToBottom = function scrollToBottom() {
  // SELECTORS
  var messages = $('#messages-list'); // // get the last msg sent by using children and getting the li that's the last child:

  var lastMsg = messages.children('li:last-child'); // HEIGHTS

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var lastMsgHeight = lastMsg.innerHeight(); // // second-to-last message:

  var penultMsgHeight = lastMsg.prev().innerHeight(); // CALCULATIONS AND CONDITIONS:

  if (clientHeight + scrollTop + lastMsgHeight + penultMsgHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  console.log('weet woo. connected to server'); //jQ has param that is a string of the search. deparam gets str and rets obj
  //deparams is a helper fcn. credit in deparam file.

  var params = $.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert('Handle and room are required.');
      window.location.href = '/';
    } else {
      console.log('no errors');
    }
  });
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
  $('#messages-list').append(html);
  scrollToBottom();
});
socket.on('createGeoLocMessage', function (geoMsg) {
  var formattedTimestamp = moment(geoMsg.createdAt).format('h:mm a');
  var template = $('#geoLoc-template').html();
  var html = Mustache.render(template, {
    url: geoMsg.url,
    createdAt: formattedTimestamp
  });
  $('#messages-list').append(html);
  scrollToBottom();
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