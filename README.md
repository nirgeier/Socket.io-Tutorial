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
