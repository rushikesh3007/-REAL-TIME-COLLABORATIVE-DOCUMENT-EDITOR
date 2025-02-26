const mongoose = require('mongoose');

// Define a Document schema
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;