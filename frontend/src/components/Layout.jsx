export function Layout({ sidebar, main }) {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar glass-surface">
        <div className="sidebar-header">
          <h1>
            <div style={{
              width: 32, height: 32, borderRadius: 8, 
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <svg style={{width: 20, height: 20, color: 'white'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            RAG<span style={{color: 'var(--primary-color)'}}>Bot</span>
          </h1>
        </div>
        
        <div style={{flex: 1, overflowY: 'auto', paddingRight: 8}}>
          {sidebar}
        </div>
        
        <div style={{
          paddingTop: 16, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)',
          borderTop: '1px solid var(--surface-border)'
        }}>
          Powered by FastAPI, ChromaDB & Groq
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {main}
      </main>
    </div>
  );
}
