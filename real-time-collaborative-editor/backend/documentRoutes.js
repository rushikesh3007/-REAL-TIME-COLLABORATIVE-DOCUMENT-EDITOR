const express = require('express');
const Document = require('../models/documentModel');
const router = express.Router();

// GET document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (error) {
    res.status(500).send('Error fetching document');
  }
});

// POST to create a new document
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title, content });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).send('Error saving document');
  }
});

module.exports = router;