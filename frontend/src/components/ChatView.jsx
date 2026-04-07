import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, FileText, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithDocument } from '../api';

const ChatView = ({ document, onReset }) => {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Hello! I've read **${document.title}**. What would you like to know about it?`
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add temporary user message
        const tempUserMsg = { id: Date.now(), role: 'user', content: userMessage };
        setMessages(prev => [...prev, tempUserMsg]);
        setLoading(true);

        try {
            const updatedMessages = await chatWithDocument(document.id, userMessage);
            // We can map server ids, or just set the entire message list (excluding initial welcome if we get full history from backend)
            // Since it's a new chat, the backend returns everything saved so far + the new msg and answer.
            setMessages([
                messages[0], // Keep welcome message
                ...updatedMessages
            ]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: 'Oops! Something went wrong while connecting to the server.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>
                    <button
                        onClick={onReset}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Upload another document"
                    >
                        <ArrowLeft size={20} style={{ marginRight: '1rem' }} />
                    </button>
                    <FileText size={20} style={{ color: 'var(--primary-color)' }} />
                    {document.title}
                </h2>
            </div>

            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={msg.id || index} className={`message ${msg.role}`}>
                        <div className="message-avatar">
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="message-content">
                            {msg.role === 'assistant' ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message assistant">
                        <div className="message-avatar">
                            <Bot size={20} />
                        </div>
                        <div className="message-content" style={{ display: 'flex', alignItems: 'center', height: '100%', minHeight: '44px' }}>
                            <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question about your PDF..."
                    disabled={loading}
                />
                <button type="submit" className="btn" disabled={!inputValue.trim() || loading}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatView;
