import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to the backend server using Socket.IO
const socket = io('http://localhost:5000');

const DocumentEditor = ({ docId }) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the document content from the backend
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/document/${docId}`);
        setContent(response.data.content);
      } catch (err) {
        console.error('Error fetching document:', err);
      }
    };
    fetchDocument();
  }, [docId]);

  // Listen for real-time updates from other users
  useEffect(() => {
    socket.on('update', ({ docId, newContent }) => {
      if (docId === docId) {
        setContent(newContent);
      }
    });

    return () => {
      socket.off('update');
    };
  }, [docId]);

  // Handle content change in the document editor
  const handleChange = (e) => {
    setContent(e.target.value);
    setIsEditing(true);
    socket.emit('edit', { docId, newContent: e.target.value });
  };

  // Save the document content
  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:5000/api/document/${docId}`, { content });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  return (
    <div>
      <h2>Document Editor</h2>
      <textarea
        value={content}
        onChange={handleChange}
        rows="20"
        cols="80"
      />
      {isEditing && (
        <button onClick={handleSave}>Save</button>
      )}
    </div>
  );
};

export default DocumentEditor;