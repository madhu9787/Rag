export function CrawlStatus({ status }) {
  if (!status || status.status === 'completed' || status.status === 'failed') return null;

  const percent = status.pages_total > 0 
    ? Math.round((status.pages_crawled / status.pages_total) * 100) 
    : 0;

  return (
    <div className="glass-surface" style={{padding: 16}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <h3 style={{color: 'white', textTransform: 'none', fontSize: 14, margin: 0}}>Crawling in progress</h3>
        <span className="status-badge crawling pulse" style={{fontSize: 10, padding: '2px 8px'}}>Active</span>
      </div>
      
      <div style={{marginBottom: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4}}>
          <span>{status.pages_crawled} / {status.pages_total} pages found</span>
          <span>{percent}%</span>
        </div>
        <div style={{height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${percent}%`, background: 'var(--primary-color)', transition: 'width 0.3s ease'}} />
        </div>
      </div>

      <div style={{fontSize: 12, color: 'var(--text-muted)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
          <span>Indexed for chat:</span>
          <span style={{color: 'white'}}>{status.indexed_count || 0} pages</span>
        </div>
        
        {status.pages && status.pages.length > 0 && (
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--surface-border)', 
            display: 'flex', flexDirection: 'column', gap: 6,
            background: 'rgba(15, 23, 42, 0.4)', borderRadius: 6, padding: '8px 12px'
          }}>
            <div style={{fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4}}>Live Crawl Feed</div>
            {status.pages.slice(-3).map((page, idx) => (
              <div key={idx} style={{display: 'flex', alignItems: 'center', fontSize: 11, animation: 'fade-in 0.2s ease-out'}}>
                <svg style={{width: 12, height: 12, color: 'var(--success-color)', marginRight: 6, flexShrink: 0}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,0.9)'}}>
                  {page.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
