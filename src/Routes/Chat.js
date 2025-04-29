// src/Routes/Chat.js
import React, { useState } from 'react';
import { Container } from 'reactstrap';
import "../assets/scss/custom/limonian-theme.scss";

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isUser: false }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I'm a placeholder response. In the real app, this would be from the AI.", 
        isUser: false 
      }]);
    }, 1000);
    
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <div className="welcome-section">
          <h2>AI Assistant</h2>
          <p>Ask me anything or use specialized tools for your tasks.</p>
        </div>
        
        <div className="ai-chat-container">
          <div className="ai-chat-header">
            <div className="ai-avatar">AI</div>
            <div className="ai-info">
              <h3>Limonian Assistant</h3>
              <p>Your AI assistant for anything you need</p>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isUser ? 'message-user' : 'message-ai'}`}>
                <div className="message-avatar">{msg.isUser ? 'U' : 'AI'}</div>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
          </div>
          
          <div className="chat-input-container">
            <textarea
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              rows="1"
            />
            <button className="btn" onClick={sendMessage}>
              Send
              <span className="send-icon">➤</span>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Chat;