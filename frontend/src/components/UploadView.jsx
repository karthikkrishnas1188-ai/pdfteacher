import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadDocument } from '../api';

const UploadView = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid PDF file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');

        try {
            const data = await uploadDocument(file);
            onUploadComplete(data);
        } catch (err) {
            console.error(err);
            setError('Failed to upload document. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <h1>PDFTeacher</h1>
            <p>Upload any PDF document and let our AI teach you its contents. Ask questions, get summaries, and learn faster.</p>

            <div
                className={`drop-zone ${file ? 'active' : ''}`}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <UploadCloud size={64} />
                {file ? (
                    <h3>{file.name}</h3>
                ) : (
                    <h3>Click to browse or drag and drop</h3>
                )}
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>PDF files up to 10MB</p>
                <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    className="file-input"
                    onChange={handleFileChange}
                />
            </div>

            {error && <p style={{ color: 'var(--danger-color)', marginTop: '1rem' }}>{error}</p>}

            <div style={{ marginTop: '2rem' }}>
                <button
                    className="btn"
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    {loading ? (
                        <><div className="loader"></div> Processing...</>
                    ) : (
                        'Start Learning'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadView;
