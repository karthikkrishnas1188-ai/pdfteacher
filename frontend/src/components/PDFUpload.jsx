import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

const PDFUpload = ({ 
  title = "Select PDF Document", 
  endpoint = "http://localhost:8000/api/upload/",
  buttonText = "Upload to Teacher"
}) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('uploading');
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
    } catch (error) {
      console.error('Upload failed', error);
      setStatus('error');
    }
  };

  return (
    <div className="upload-section">
      <label className="upload-box">
        <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
        {status === 'success' ? (
          <CheckCircle size={48} color="#10b981" />
        ) : file ? (
          <FileText size={48} color="var(--primary-color)" />
        ) : (
          <UploadCloud size={48} />
        )}
        <h3>{file ? file.name : title}</h3>
        <p>{file ? "Ready to upload" : "Click or drag file here"}</p>
      </label>

      {file && (
        <button className="upload-button" onClick={handleUpload} disabled={status === 'uploading'}>
          {status === 'uploading' ? 'Uploading...' : buttonText}
        </button>
      )}
    </div>
  );
};

export default PDFUpload;
