import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 


const DocumentEditor = () => {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

  useEffect(() => {
    // Fetch the document by ID
    axios.get(`/api/documents/${documentId}`)
      .then(response => {
        setDocument(response.data);
        setContent(response.data.content);
      })
      .catch(err => console.log(err));

    // Listen for document changes from other users
    socket.on('document-edit', (data) => {
      setContent(data.content);
    });

    return () => {
      socket.off('document-edit');
    };
  }, [documentId, socket]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Emit content changes to other users
    socket.emit('document-edit', { content: newContent });
  };

  return (
    <div>
      <h1>Editing: {document?.title}</h1>
      <textarea 
        value={content} 
        onChange={handleContentChange} 
        rows="20" 
        cols="80" />
    </div>
  );
};

export default DocumentEditor;