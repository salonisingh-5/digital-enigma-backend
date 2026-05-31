import React, { useState, useRef, useEffect } from 'react';
import './AIChat.css';

const INITIAL_MESSAGES = [
  { sender: 'ai', text: "Hello hacker! I'm Enigma AI." },
  { sender: 'ai', text: "Need a hint? It'll cost you some tokens." },
  { sender: 'ai', text: 'Ask me anything about the challenges!' },
];

export default function AIChat({ messages, onSend, isLoading }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const displayMessages = messages || INITIAL_MESSAGES;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend && onSend(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="ai-chat">
      {/* Header */}
      <div className="ai-chat__header">
        <span className="ai-chat__title">ENIGMA AI</span>
        <span className="ai-chat__beta">BETA</span>
      </div>

      {/* Messages */}
      <div className="ai-chat__messages">
        {displayMessages.map((msg, i) => (
          <div key={i} className={`ai-msg ai-msg--${msg.sender}`}>
            {msg.sender === 'ai' && (
              <div className="ai-avatar">
                <svg viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1"/>
                  <circle cx="16" cy="12" r="4" fill="#8b5cf6" opacity="0.8"/>
                  <circle cx="12" cy="16" r="1.5" fill="#22d3ee"/>
                  <circle cx="20" cy="16" r="1.5" fill="#22d3ee"/>
                  <path d="M11 22 Q16 18 21 22" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            <div className="ai-msg__bubble">
              <span className="ai-msg__text">{msg.text}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-msg ai-msg--ai">
            <div className="ai-avatar">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1"/>
                <circle cx="16" cy="12" r="4" fill="#8b5cf6" opacity="0.8"/>
              </svg>
            </div>
            <div className="ai-msg__bubble ai-typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-chat__input-row">
        <input
          className="ai-chat__input"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="ai-chat__send" onClick={handleSend}>
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3 10 L17 10 M12 5 L17 10 L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
