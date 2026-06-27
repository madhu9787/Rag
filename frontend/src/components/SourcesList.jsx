export function SourcesList({ sources, isLoading, onDelete, onSelect, selectedId }) {
  if (isLoading && sources.length === 0) {
    return (
      <div className="glass-surface" style={{padding: 20, textAlign: 'center'}}>
        <div className="pulse" style={{color: 'var(--text-muted)'}}>Loading sources...</div>
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="glass-surface" style={{padding: 30, textAlign: 'center', color: 'var(--text-muted)'}}>
        <svg style={{width: 32, height: 32, margin: '0 auto 12px', opacity: 0.5}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p style={{fontSize: 14}}>No knowledge bases yet.</p>
        <p style={{fontSize: 12, marginTop: 4, opacity: 0.7}}>Add a URL above to start.</p>
      </div>
    );
  }

  return (
    <div className="glass-surface" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{padding: '16px 20px', borderBottom: '1px solid var(--surface-border)'}}>
        <h3 style={{margin: 0, color: 'white', textTransform: 'none', fontSize: 16, display: 'flex', alignItems: 'center'}}>
          <svg style={{width: 18, height: 18, marginRight: 8, color: 'var(--accent-color)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Active Sources ({sources.length})
        </h3>
      </div>
      
      <div style={{flex: 1, overflowY: 'auto', padding: 12}}>
        {sources.map(source => (
          <div 
            key={source.id} 
            className={`source-item ${selectedId === source.id ? 'active' : ''}`}
            onClick={() => onSelect(selectedId === source.id ? null : source.id)}
          >
            <div className="source-info">
              <div className="source-title" title={source.title}>{source.title}</div>
              <div className="source-meta">
                {new URL(source.url).hostname} • {source.page_count} pages
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this source? This cannot be undone.')) {
                  onDelete(source.id);
                  if (selectedId === source.id) onSelect(null);
                }
              }}
              className="danger"
              style={{padding: 6, opacity: 0.7}}
              title="Delete source"
            >
              <svg style={{width: 16, height: 16}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
