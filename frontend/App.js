import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server (change the URL if your backend is hosted elsewhere)
const socket = io('http://localhost:5000');

function App() {
  const [documentContent, setDocumentContent] = useState('');

  // Listen for changes to the document content from other clients
  useEffect(() => {
    // Listen for 'document-changed' events from the server (other clients)
    socket.on('document-changed', (newContent) => {
      setDocumentContent(newContent);
    });

    // Clean up when the component is unmounted
    return () => {
      socket.off('document-changed');
    };
  }, []);

  // Handle the content change in the textarea and emit the change to the backend
  const handleChange = (e) => {
    const newContent = e.target.value;
    setDocumentContent(newContent);

    // Emit the change to the server to notify other clients
    socket.emit('document-changed', newContent);
  };

  return (
    <div className="App">
      <h1>Real-Time Collaborative Document Editor</h1>
      <textarea
        value={documentContent}
        onChange={handleChange}
        placeholder="Start typing here..."
        rows="15"
        cols="50"
      />
    </div>
  );
}

export default App;