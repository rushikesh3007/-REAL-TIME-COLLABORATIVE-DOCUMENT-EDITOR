import React from 'react';
import DocumentEditor from './components/DocumentEditor';

const App = () => {
  const docId = "60b6f9f5f3d0e1bc6c60d78a"; // Example document ID

  return (
    <div className="App">
      <h1>Collaborative Document Editor</h1>
      <DocumentEditor docId={docId} />
    </div>
  );
};

export default App;