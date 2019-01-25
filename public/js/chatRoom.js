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