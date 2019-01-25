var UTILS = (function () {

  // Set the scroller
  $(".chat-room").niceScroll();

  /**
   * Add message to the chat room
   */
  function addMessage(message) {
    let position = message.username == 'bot' ? 'left' : 'right';
    let content = `
        <div class="chat-message ${position}">
          <div class="avatar">
            <img src="${message.avatar}">
            <div class="status offline"></div>
          </div>
          <div class="text">${message.text}</div>
          <div class="time">${message.timestamp}</div>
        </div>`;

    // Append the content
    $("div#chat-messages").append(content);

    // Scroll if required
    $(".chat-room").scrollTop($(".chat-room").prop("scrollHeight"));
  }

  function showTyping(message) {
    $(".feedback").html(`Someone is typing: ${message}`);
  }

  return {
    addMessage: addMessage,
    showTyping: showTyping
  }
})();