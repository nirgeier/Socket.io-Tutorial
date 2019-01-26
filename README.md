# Socket.io-Tutorial
- This repository will teach you Socket.IO.

---
### Step 01 Prepare the project skeleton 
### Pre-requirements:

- In this tutorial we will be creating a simple Socket.IO chat application.
- We will be using Express as our web server

#### Initialize the project
```sh
# Create the project folder
mkdir socket-demo

# Create nodejs project
cd socket-demo && npm init -y

# Install the requirements
npm i nodemon express socket.io

# Copy the content of public folder into your project
# It contain the images, css & js for the chat room
```

### Create the minimal express server
- Create ['index.js'](index.js) which will be our express server
  ```js
  const express = require('express');

  var app = express();

  // Listen for requests and serve the default 
  // index file from the public folder
  app.use(express.static('public'));

  // We need to store the server in variable so we
  // can use it later on with the socket.io
  const server = app.listen(4000, () => {
    console.log('Server listening on port 4000. http://localhost:4000');
  });
  ```
---
### Step02 Establishing connection between server and client

**We need to have `socket.io` both on the client (html) and on the server (npm i)**

- Add the required `socket.io` to the ['index.js'](index.js)
- Add the `connection` event in the ['index.js'](index.js)
  ```js
  const socket = require('socket.io');
  ...
  // Init the socket.io for this app
  var io = socket(server);

  // Listen for WebSocket connection
  io.on('connection', (socket) => {
    console.log(`Connection opened. Socket id is: ${socket.id}`);

    // Listen for the message event from the client
    socket.on('add-message', (message) => {
      console.log(message);
    });

  ```
- Update the [`public/js/chatRoom.js`](`public/js/chatRoom.js`)
  ```js
  (function () {

  // Open connection to the server (WebSocket)
  const socket = io.connect(`http://localhost:4000`);

  // Grab the message input field
  const messageInput = document.querySelector('.message');

  // Capture the click event on the send
  document.querySelector('.message-send')
    .addEventListener('click', () => {
      // now we want to send the message to the server
      // We will emit a chat event
      socket.emit('add-message', {
        username: 'User',
        text: messageInput.value,
        timestamp: new Date().toLocaleTimeString(),
        // We have avatars from 1 to 8
        avatar: `/images/avatar${Date.now() % 7 + 1}.png`
      }); // emit
    }); // addEventListener
  })();
  ```
- Open the browser and verify that you see the connection message in your terminal
- Send a message form the client and you should see it in your terminal as well
```js
{ 
  username: 'User',
  text: 'Test message',
  timestamp: '20:38:40',
  avatar: '/images/avatar4.png' 
}
```
---

### Step03 Send messages back to the client
- Add the event listener in the chatroom [`public/js/chatRoom.js`](`public/js/chatRoom.js`)
```js
  // When user is typing - submit the event to the server
  messageInput.addEventListener('keypress', () => {
    socket.emit('typing', messageInput.value);
  });

   /**
   * Listen for incoming message from the server.
   * Once message is received we adding it to the chat room 
   */
  socket.on('message', (message) => {
    console.log('Got message on the client:', message);
    UTILS.addMessage(message);
  });

   /**
   * Listen for incoming typing message from the server.
   * this event is triggered when user is typing. The event is
   * being submitted by the server
   */
  socket.on('typing', (message) => {
    console.log('Got typing message on the client:', message);
    UTILS.showTyping(message);
  });
```
- Broadcast message are being send to all the sockets **except** origin one.
- Update [`public/index.html`](public/index.html) and add the required events
```js
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

});
```
---
### Step04 Broadcasting images (Download from the server)
- In this step we will send image from the server to the client and we will display it on the main page.
- Add the following code to the [`index.js`](index.js)
```js
const fs = require('fs');
...
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
```
- Update the template [`public/index.html`](public/index.html) and add this code after the `</head>`
```html
<div class="row text-center">
  <a href="#" class="upload-image">Download image (simulate reading delay)</a>
  <img class="stream-image">
</div>
<hr />
```
- Add the events inside [`public/js/chatRoom.js`](public/js/chatRoom.js)
```js
/* ----------------------------------------
  *           Sending images
  * ---------------------------------------- */

// When user is click on the upload image - submit the event to the server
document.querySelector('.upload-image')
  .addEventListener('click', () => {
    // Clear all previous data
    socket.emit('get-image');
  });
/**
 * Listen for incoming image message.
 */
socket.on('message-image', (chunk) => {
  console.log(`Got image message on the client.`);
  console.log(`base64Img.length: ${chunk.length}`)
  document.querySelector('.stream-image').src = `data:image/jpeg;base64,${chunk}`;
});
```
- Open your browser and test the code