const socket = io(); // Connect to the server

const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message-button');
const chatMessages = document.getElementById('chat-messages');

sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        // Emit the "send-message" event with the message content
        socket.emit('send-message', { message });
        messageInput.value = ''; // Clear the input field after sending
    }
});

// Listen for received messages from the server
socket.on('receive-message', (data) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = data.message;
    chatMessages.appendChild(messageElement);
});
