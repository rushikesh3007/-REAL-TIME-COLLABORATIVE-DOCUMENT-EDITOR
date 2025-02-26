import React from 'react';
import ReactDOM from 'react-dom/client';  // Import the 'react-dom/client' package
import App from './App';

// Create a root with createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);