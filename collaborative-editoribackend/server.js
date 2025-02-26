const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collaborativeEditor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Import the Document model
const Document = require('./models/Document');

// API to fetch a document by ID
app.get('/api/document/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (err) {
    res.status(400).json({ error: 'Document not found' });
  }
});

// API to update the document content
app.post('/api/document/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const document = await Document.findByIdAndUpdate(req.params.id, { content }, { new: true });
    res.json(document);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update document' });
  }
});

// Real-time collaboration using Socket.IO
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for document edit events
  socket.on('edit', async ({ docId, newContent }) => {
    // Broadcast the content change to all other users
    socket.broadcast.emit('update', { docId, newContent });
    // Optionally, save the new content to the database
    await Document.findByIdAndUpdate(docId, { content: newContent });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});