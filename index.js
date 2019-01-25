const express = require('express');
const socket = require('socket.io');

var app = express();

// Listen for requests and serve the default 
// index file from the public folder
app.use(express.static('public'));

// We need to store the server in variable so we
// can use it later on with the socket.io
const server = app.listen(4000, () => {
  console.log('Server listening on port 4000. http://localhost:4000');
});

// Init the socket.io for this app
var io = socket(server);

// Listen for WebSocket connection
io.on('connection', (socket) => {
  console.log(`Connection opened. Socket id is: ${socket.id}`);

  // Listen for the message event from the client
  socket.on('add-message', (message) => {
    console.log(message);
  });

});