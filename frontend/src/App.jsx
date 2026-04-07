import React, { useState } from 'react';
import UploadView from './components/UploadView';
import ChatView from './components/ChatView';

function App() {
  const [activeDocument, setActiveDocument] = useState(null);

  const handleUploadComplete = (doc) => {
    setActiveDocument(doc);
  };

  const handleReset = () => {
    setActiveDocument(null);
  };

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {!activeDocument ? (
          <UploadView onUploadComplete={handleUploadComplete} />
        ) : (
          <ChatView document={activeDocument} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
