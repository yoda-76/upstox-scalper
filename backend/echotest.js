const io = require('socket.io-client');
const serverUrl = 'http://localhost:4000'; // Replace with your server URL
const socket = io(serverUrl);

socket.on('connect', () => {
  console.log(`Connected to Socket.IO server with id ${socket.id}`);
//   startChat();
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
  process.exit();
});

