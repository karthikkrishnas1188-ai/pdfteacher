import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const chatWithDocument = async (documentId, message) => {
    const response = await axios.post(`${API_BASE_URL}/documents/${documentId}/chat/`, {
        message
    });
    return response.data; // Returns list of messages
};
