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
