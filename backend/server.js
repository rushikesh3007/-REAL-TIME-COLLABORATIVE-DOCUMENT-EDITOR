const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create the Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server);

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit changes to all other clients
  socket.on('documentUpdate', (data) => {
    // Emit the data to all other clients except the sender
    socket.broadcast.emit('documentUpdate', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const cors = require('cors');

// Enable CORS for all origins (or specify specific origins)
app.use(cors());