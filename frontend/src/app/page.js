'use client';

import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Vaani, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a placeholder response. Connect me to your AI backend to enable real conversations!' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Vaani</h1>
          <p className={styles.subtitle}>AI Assistant</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className={styles.chatContainer}>
        <div className={styles.messagesWrapper}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
            >
              <div className={styles.messageAvatar}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageName}>
                  {message.role === 'user' ? 'You' : 'Vaani'}
                </div>
                <div className={styles.messageText}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageAvatar}>🤖</div>
              <div className={styles.messageContent}>
                <div className={styles.messageName}>Vaani</div>
                <div className={styles.messageText}>
                  <span className={styles.typing}>Typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Vaani anything..."
            className={styles.input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={!input.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 10L18 2L10 18L9 11L2 10Z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
