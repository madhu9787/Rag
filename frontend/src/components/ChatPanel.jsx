import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatPanel({ messages, isStreaming, error, onSendMessage, hasSources }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || !hasSources) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 20, overflow: 'hidden',
      background: 'var(--chat-panel-bg)', border: '1px solid var(--surface-border)', backdropFilter: 'blur(20px)',
      boxShadow: 'var(--surface-glow)'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--surface-border)', 
        background: 'var(--chat-header-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{display: 'flex', alignItems: 'center', margin: 0, fontSize: 18, color: 'var(--text-primary)', fontWeight: 700}}>
            <div style={{width: 28, height: 28, borderRadius: 8, background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
              <svg style={{width: 16, height: 16, color: 'var(--primary-color)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Nexus AI Assistant
          </h2>
          <p style={{fontSize: 13, color: 'var(--text-muted)', marginTop: 6, marginBottom: 0}}>Ask any question about your indexed knowledge bases</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: 16}}>
            <div style={{
              width: 80, height: 80, borderRadius: 40, background: 'var(--chat-empty-icon-bg)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)'
            }}>
              <svg style={{width: 40, height: 40, color: 'var(--primary-color)', opacity: 0.9}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            {hasSources ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 600}}>
                <h3 style={{fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'none', letterSpacing: 0, marginBottom: 8}}>Knowledge Base Ready</h3>
                <p style={{marginBottom: 24, textAlign: 'center'}}>Ask a question below, or try one of these suggestions:</p>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, width: '100%'}}>
                  {[
                    "Can you summarize the main topics of this website?",
                    "What are the key products or services offered?",
                    "What is the main goal or purpose of this content?"
                  ].map((suggestion, i) => (
                    <button 
                      key={i} 
                      onClick={() => onSendMessage(suggestion)}
                      style={{
                        background: 'var(--chat-suggestion-bg)', border: '1px solid var(--surface-border)', 
                        padding: '16px', borderRadius: '12px', color: 'var(--text-color)', 
                        textAlign: 'left', fontSize: '13px', lineHeight: '1.4',
                        transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--surface-border)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'var(--chat-suggestion-bg)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 20
                }}
              >
                <motion.h3 
                  animate={{ color: ['var(--text-muted)', 'var(--primary-color)', 'var(--text-muted)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ fontSize: 20, fontWeight: 700, margin: 0 }}
                >
                  No Knowledge Base Found
                </motion.h3>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ boxShadow: ['0 0 0px rgba(139, 92, 246, 0)', '0 0 20px rgba(139, 92, 246, 0.5)', '0 0 0px rgba(139, 92, 246, 0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px 24px', 
                    borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                  onClick={() => document.querySelector('input[type="url"]')?.focus()}
                >
                  <svg style={{width: 20, height: 20}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Click here to start ingestion
                </motion.button>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {error && (
              <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0', animation: 'fade-in 0.3s'}}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14, textAlign: 'center', maxWidth: 400
                }}>
                  <strong style={{display: 'block', marginBottom: 4}}>Error processing request</strong>
                  <span style={{color: 'rgba(239, 68, 68, 0.8)'}}>{error}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div style={{padding: '24px', background: 'var(--chat-input-area)', borderTop: '1px solid var(--surface-border)', backdropFilter: 'blur(10px)'}}>
        <form onSubmit={handleSubmit} style={{position: 'relative', maxWidth: 800, margin: '0 auto'}}>
          <motion.div 
            whileFocus={{ scale: 1.01 }}
            style={{position: 'relative', borderRadius: 20, background: 'var(--chat-input-bg)', border: '1px solid var(--surface-border)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', transition: 'all 0.3s'}} className="chat-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming || !hasSources}
              placeholder={hasSources ? "Message Nexus AI..." : "Waiting for knowledge base..."}
              style={{
                width: '100%', padding: '20px 64px 20px 24px', fontSize: 16, borderRadius: 20,
                background: 'transparent', border: 'none', color: 'var(--text-color)', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming || !hasSources}
              style={{
                position: 'absolute', right: 10, top: 10, bottom: 10, padding: 0, width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, borderRadius: 14,
                background: input.trim() ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'rgba(128,128,128,0.1)',
                color: input.trim() ? 'white' : 'var(--text-muted)',
                boxShadow: input.trim() ? '0 4px 12px rgba(79, 70, 229, 0.4)' : 'none',
                transition: 'all 0.2s', border: 'none', cursor: input.trim() ? 'pointer' : 'default'
              }}
            >
              <svg style={{width: 20, height: 20}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
