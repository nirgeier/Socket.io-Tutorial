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
})();