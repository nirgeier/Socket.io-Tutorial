const express = require('express');
const socket = require('socket.io');
const fs = require('fs');

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
    // Broadcast the message to all the open sockets
    io.sockets.emit('message', message);
  });

  socket.on('typing', (message) => {
    // Broadcast the message to all the open sockets
    socket.broadcast.emit('typing', message);
  });

  socket.on('get-image', () => {
    console.log(`Got request to send image`);
    // Broadcast the message to all the open sockets
    var readStream = fs.createReadStream(__dirname + '/public/images/socket.io.jpg'),
      emitDelay = 0;

    // Listen for reading 
    readStream.on('data', (chunk) => {
      console.log(`Sending image to the client. #of bytes: ${chunk.length}`);
      // Split the chunks in to a smaller chunks and send them slowly
      // to the client so we will be able to see the progress
      let data = Buffer.from(chunk).toString('base64');

      for (let index = 0; index < data.length; index += 100) {
        setTimeout(() => {
          socket.emit('message-image', data.substring(0, index));
        }, emitDelay);
        // Set delay so we can it see loading on the client side
        emitDelay += 10;
      } // for
    }); // readStream.on
  });
});