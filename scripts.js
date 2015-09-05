// Create a Socket.io connection
var socket = io();
// Create a Feathers client that uses that connection
var app = feathers().configure(feathers.socketio(socket));
// Get the messages service
var messages = app.service('messages');

// C.R.E.A.M -  cache your elements
var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('.messages');

function addMessage(data) {
  var username = data.name || 'anonymous';
  var message = data.text;

  // Create an element
  var nameElement = $('<strong>').text(username);
  var messageElement = $('<li>').text(message).prepend(nameElement);

  // Add the message to the DOM
  messageList.append(messageElement);

  // Scroll to the bottom of the message list
  messageList[0].scrollTop = messageList[0].scrollHeight;
}

// Listen for the form submit
$('.chat').on('submit',function(e) {

  // stop the form from submitting
  e.preventDefault();

  // create a message object
  var message = {
    name : nameField.val(),
    text : messageField.val()
  }

  // Save data to the messages service
  messages.create(message);

  // clear message field
  messageField.val('');

});

// Add new messages
messages.on('created', addMessage);

// Find the last 10 messages and add them
messages.find(function(error, messages) {
  if(messages) {
    messages.forEach(addMessage);
  }
});
