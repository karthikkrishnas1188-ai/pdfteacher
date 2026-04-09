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
        <div className="sidebar">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Your Document</h2>
          <PDFUpload />
        </div>
        <Chat />
      </div>
    </div>
  );
}

export default App;
