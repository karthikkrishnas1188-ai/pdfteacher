import React from 'react';
import Chat from './components/Chat';
import PDFUpload from './components/PDFUpload';

function App() {
  return (
    <div className="app-container">
      <div className="header">
        <h1 className="header-title">PDF Teacher</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI Powered</div>
      </div>
      <div className="main-content">
        <div className="sidebar" style={{ overflowY: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Study Materials</h2>
          <PDFUpload 
            title="Select Study Material"
            endpoint="http://localhost:8000/api/upload/"
            buttonText="Upload Material"
          />
          
          <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Question Papers</h2>
          <PDFUpload 
            title="Select Question Paper"
            endpoint="http://localhost:8000/api/upload-question-paper/"
            buttonText="Upload Paper"
          />
        </div>
        <Chat />
      </div>
    </div>
  );
}

export default App;
