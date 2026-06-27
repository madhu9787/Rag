import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (question, sourceIds) => {
    if (!question.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setError(null);

    // Placeholder for assistant message
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', sources: [] }]);

    try {
      await api.streamChat(question, sourceIds, (event, data) => {
        if (event === 'sources') {
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, sources: data } : m
          ));
        } else if (event === 'token') {
          setMessages(prev => prev.map(m => 
            m.id === assistantId ? { ...m, content: m.content + data.content } : m
          ));
        } else if (event === 'error') {
          setError(data.error);
        }
      });
    } catch (err) {
      setError(err.message);
      // Remove empty assistant message if it failed immediately
      setMessages(prev => prev.filter(m => m.id !== assistantId || m.content.length > 0));
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, isStreaming, error, sendMessage };
}
