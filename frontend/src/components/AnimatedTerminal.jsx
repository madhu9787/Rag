import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AnimatedTerminal() {
  const [step, setStep] = useState(0);

  const lines = [
    { text: "nexus-cli --ingest https://example.com", type: "command", delay: 1000 },
    { text: "Initializing Website Intelligence Engine...", type: "system", delay: 1000 },
    { text: "Crawling https://example.com", type: "system", delay: 800 },
    { text: "✓ Page 1 Indexed", type: "success", delay: 400 },
    { text: "✓ Page 2 Indexed", type: "success", delay: 400 },
    { text: "✓ Page 3 Indexed", type: "success", delay: 400 },
    { text: "✓ Extracting Content...", type: "success", delay: 600 },
    { text: "✓ Creating Knowledge Chunks...", type: "success", delay: 600 },
    { text: "✓ Generating Embeddings...", type: "success", delay: 800 },
    { text: "✓ Building Vector Index...", type: "success", delay: 800 },
    { text: "✓ AI Ready", type: "success", delay: 1000 },
    { text: "What authentication methods are supported?", type: "user-query", delay: 1500 },
    { text: "The website supports OAuth2, JWT authentication, and API keys. You can find detailed implementations in the /auth-docs section.", type: "ai-response", delay: 2000 }
  ];

  useEffect(() => {
    let currentStep = 0;
    const timeouts = [];

    const advanceStep = () => {
      if (currentStep < lines.length) {
        timeouts.push(
          setTimeout(() => {
            setStep((s) => s + 1);
            currentStep++;
            advanceStep();
          }, lines[currentStep].delay)
        );
      }
    };

    advanceStep();

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: 600, 
      background: '#0a0a0a', 
      border: '1px solid rgba(255,255,255,0.1)', 
      borderRadius: 16, 
      overflow: 'hidden', 
      boxShadow: 'var(--surface-glow)' 
    }}>
      <div style={{ height: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: '#171717' }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ef4444' }}></div>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#eab308' }}></div>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: '#22c55e' }}></div>
        <div style={{ marginLeft: 16, color: '#a1a1aa', fontSize: 12, fontFamily: 'monospace' }}>nexus-terminal</div>
      </div>
      <div style={{ padding: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.6, color: '#e5e5e5', minHeight: 400 }}>
        {lines.slice(0, step).map((line, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 8 }}
          >
            {line.type === 'command' && <span style={{ color: '#3b82f6' }}>$ </span>}
            {line.type === 'system' && <span style={{ color: '#a1a1aa' }}></span>}
            {line.type === 'success' && <span style={{ color: '#10b981' }}></span>}
            {line.type === 'user-query' && <div style={{ color: '#ec4899', marginTop: 16 }}>User &gt; <span style={{ color: '#f4f4f5' }}>{line.text}</span></div>}
            {line.type === 'ai-response' && <div style={{ color: '#3b82f6', marginTop: 8 }}>AI &gt; <span style={{ color: '#a1a1aa' }}><Typewriter text={line.text} /></span></div>}
            
            {line.type !== 'user-query' && line.type !== 'ai-response' && (
               <span style={{ color: line.type === 'success' ? '#10b981' : line.type === 'command' ? '#f4f4f5' : '#a1a1aa' }}>
                 {line.text}
               </span>
            )}
          </motion.div>
        ))}
        {step < lines.length && (
           <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: 8, height: 16, background: '#a1a1aa', display: 'inline-block', marginTop: 4 }} />
        )}
      </div>
    </div>
  );
}

function Typewriter({ text }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
