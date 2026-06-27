import { useState } from 'react';

export function UrlIngestForm({ onSubmit, isIngesting, isReady }) {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxDepth, setMaxDepth] = useState(2);
  const [maxPages, setMaxPages] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || isIngesting) return;
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      finalUrl = 'https://' + url;
    }
    
    onSubmit(finalUrl, maxDepth, maxPages);
    setUrl('');
  };

  return (
    <div className="glass-surface" style={{padding: 20}}>
      <h3 style={{display: 'flex', alignItems: 'center', color: 'white', fontSize: 16, marginBottom: 16, textTransform: 'none'}}>
        <svg style={{width: 20, height: 20, marginRight: 8, color: 'var(--primary-color)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Add Knowledge Base
      </h3>
      
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div className="input-group">
          <label htmlFor="url" style={{fontSize: 13, color: 'var(--text-muted)'}}>Website URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isIngesting}
            placeholder="https://docs.example.com"
            required
          />
        </div>

        <div>
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{background: 'transparent', padding: 0, color: 'var(--text-muted)', fontSize: 12, justifyContent: 'flex-start'}}
          >
            <svg style={{width: 14, height: 14, marginRight: 4, transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Settings
          </button>
          
          {showAdvanced && (
            <div style={{marginTop: 12, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label htmlFor="depth" style={{fontSize: 12, color: 'var(--text-muted)'}}>Crawl Depth</label>
                <input 
                  type="number" 
                  id="depth" 
                  min="0" max="5" 
                  value={isNaN(maxDepth) ? '' : maxDepth}
                  onChange={(e) => setMaxDepth(e.target.value === '' ? '' : parseInt(e.target.value))}
                  disabled={isIngesting}
                  style={{width: 60, padding: '4px 8px'}}
                />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <label htmlFor="pages" style={{fontSize: 12, color: 'var(--text-muted)'}}>Max Pages</label>
                <input 
                  type="number" 
                  id="pages" 
                  min="1" max="200" 
                  value={isNaN(maxPages) ? '' : maxPages}
                  onChange={(e) => setMaxPages(e.target.value === '' ? '' : parseInt(e.target.value))}
                  disabled={isIngesting}
                  style={{width: 60, padding: '4px 8px'}}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!url || isIngesting}
          style={{width: '100%', marginTop: 8}}
        >
          {isIngesting && !isReady
            ? 'Indexing first pages…'
            : isIngesting && isReady
            ? 'Crawling in background…'
            : 'Start Ingestion'}
        </button>
      </form>
    </div>
  );
}
