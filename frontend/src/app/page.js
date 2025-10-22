'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m Vaani, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [currentConversationSaved, setCurrentConversationSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('vaani_conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (!mounted || messages.length <= 1) return;

    // Generate title from first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return;

    const title = firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
    const preview = messages[messages.length - 1].content.slice(0, 60) + '...';
    const timestamp = 'Just now';

    if (!currentConversationSaved) {
      // Create new conversation
      const newConv = {
        id: Date.now(),
        title,
        timestamp,
        preview,
        messages: [...messages]
      };
      
      setConversations(prev => {
        const updated = [newConv, ...prev];
        localStorage.setItem('vaani_conversations', JSON.stringify(updated));
        return updated;
      });
      
      setActiveConversationId(newConv.id);
      setCurrentConversationSaved(true);
    } else {
      // Update existing conversation
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, preview, timestamp, messages: [...messages] }
            : conv
        );
        localStorage.setItem('vaani_conversations', JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, mounted, currentConversationSaved, activeConversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Call the API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message || 'Sorry, I encountered an error.'
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      { role: 'assistant', content: 'Hello! I\'m Vaani, your AI assistant. How can I help you today?' }
    ]);
    setActiveConversationId(null);
    setCurrentConversationSaved(false);
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setActiveConversationId(conversationId);
      setCurrentConversationSaved(true);
    }
  };

  const handleDeleteConversation = (conversationId, e) => {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(conv => conv.id !== conversationId);
      localStorage.setItem('vaani_conversations', JSON.stringify(updated));
      return updated;
    });
    if (activeConversationId === conversationId) {
      handleNewChat();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (timestamp === 'Just now') return timestamp;
    return timestamp;
  };

  // Prevent hydration error by not rendering until mounted
  if (!mounted) {
    return null;
  }

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
