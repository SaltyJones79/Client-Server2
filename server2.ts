import * as net from 'net';
import { handleClient } from './client2';

const PORT = 3000;

// Create a new server instance
const server = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress, socket.remotePort);

  // Pass the connected client socket to the handleClient function
  handleClient(socket);
});

// Handle server errors
server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});

// Start listening for incoming client connections
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
