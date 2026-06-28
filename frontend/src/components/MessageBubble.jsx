import ReactMarkdown from 'react-markdown';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div style={{display: 'flex', width: '100%', justifyContent: isUser ? 'flex-end' : 'flex-start', animation: 'fade-in 0.3s ease-out forwards'}}>
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        <div className="markdown-body">
          {message.content ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', width: '250px', paddingTop: '4px'}}>
              <div className="skeleton-line"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          )}
        </div>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--surface-border)'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0}}>Sources cited</p>
              {message.confidence !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: message.confidence > 80 ? '#10b981' : message.confidence > 60 ? '#f59e0b' : '#ef4444' }}>
                    {message.confidence}% Confidence
                  </span>
                </div>
              )}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
              {message.sources.map((source, idx) => {
                let hostname = source.url;
                try { hostname = new URL(source.url).hostname; } catch(e){}
                
                return (
                  <a 
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', fontSize: 12, padding: '4px 10px', 
                      borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-color)',
                      textDecoration: 'none', border: '1px solid var(--surface-border)', maxWidth: 250,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}
                    title={source.title || source.url}
                  >
                    <svg style={{width: 12, height: 12, marginRight: 6, flexShrink: 0, color: 'var(--text-muted)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{source.title || hostname}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
