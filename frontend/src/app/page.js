'use client';

import { useState } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Vaani, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Getting Started with Vaani', timestamp: '2 hours ago', preview: 'Hello! I\'m Vaani...' },
    { id: 2, title: 'Project Ideas Discussion', timestamp: 'Yesterday', preview: 'Can you help me with...' },
    { id: 3, title: 'Code Review Session', timestamp: '2 days ago', preview: 'I need help reviewing...' },
  ]);
  const [activeConversationId, setActiveConversationId] = useState(1);

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

  const handleNewChat = () => {
    setMessages([
      { role: 'assistant', content: 'Hello! I\'m Vaani, your AI assistant. How can I help you today?' }
    ]);
    setActiveConversationId(null);
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    // In a real app, load the conversation messages from your backend
    setMessages([
      { role: 'assistant', content: 'Loading previous conversation...' }
    ]);
  };

  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId) {
      handleNewChat();
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <button className={styles.newChatButton} onClick={handleNewChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Chat
          </button>
        </div>

        <div className={styles.conversationList}>
          <h3 className={styles.conversationTitle}>Recent Conversations</h3>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${activeConversationId === conversation.id ? styles.activeConversation : ''}`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className={styles.conversationInfo}>
                <div className={styles.conversationItemTitle}>{conversation.title}</div>
                <div className={styles.conversationPreview}>{conversation.preview}</div>
                <div className={styles.conversationTimestamp}>{conversation.timestamp}</div>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDeleteConversation(conversation.id, e)}
                title="Delete conversation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.userProfile}>
            <span className={styles.userAvatar}>👤</span>
            <span className={styles.userName}>Guest User</span>
          </button>
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        className={styles.toggleSidebar}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isSidebarOpen ? (
            <path d="M15 18l-6-6 6-6"/>
          ) : (
            <path d="M9 18l6-6-6-6"/>
          )}
        </svg>
      </button>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <h1 className={styles.logo}>Vaani</h1>
              <p className={styles.subtitle}>AI Assistant</p>
            </div>
            <div className={styles.headerRight}>
              <a href="/auth" className={styles.authButton}>
                Login / Sign Up
              </a>
            </div>
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
    </div>
  );
}
