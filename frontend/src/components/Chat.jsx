import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Upload a PDF on the left, and ask me anything about it.", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chat/', {
        message: input
      });
      
      const botMsg = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error', error);
      const errorMsg = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Ask a question..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-button" disabled={!input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
