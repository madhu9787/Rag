import { Globe, FileText, MessageSquare, Clock } from 'lucide-react';
import { useSources } from '../hooks/useSources';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

export function Dashboard() {
  const { sources, fetchSources } = useSources();
  const { userName } = useUser();

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const stats = [
    { label: 'Websites Indexed', value: sources.length, icon: <Globe color="#3b82f6" /> },
    { label: 'Total Pages Crawled', value: sources.reduce((acc, s) => acc + (s.page_count || 0), 0), icon: <FileText color="#10b981" /> },
    { label: 'Vector Embeddings', value: sources.reduce((acc, s) => acc + (s.chunk_count || 0), 0), icon: <Database color="#8b5cf6" /> },
    { label: 'Avg Latency', value: '1.2s', icon: <Clock color="#f59e0b" /> },
  ];

  return (
    <motion.div className="dashboard-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(40px)', zIndex: -1, borderRadius: '50%' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(50px)', zIndex: -1, borderRadius: '50%' }}
      />

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
        Welcome back, {userName}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 16 }}>Here's what's happening in your RAG Workspace today.</p>

      {/* Stats Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 48 }}
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px -10px var(--surface-border)' }}
            style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--surface-border)', 
              padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
              backdropFilter: 'blur(12px)', cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Subtle glow effect behind the card */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--primary-color)', opacity: 0.05, borderRadius: '50%', filter: 'blur(20px)' }} />
            
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.1)', zIndex: 1 }}>
              {stat.icon}
            </div>
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>
        Recent Knowledge Bases
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(12px)' }}
      >
        {sources.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#e2e8f0' }}>
            <Globe size={48} style={{ opacity: 0.3, margin: '0 auto 16px', color: 'var(--primary-color)' }} />
            <p style={{ fontSize: 16 }}>No websites indexed yet. Go to the Knowledge Base to start crawling.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(139, 92, 246, 0.05)', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '20px 24px', fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600 }}>Source URL</th>
                <th style={{ padding: '20px 24px', fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600 }}>Pages</th>
                <th style={{ padding: '20px 24px', fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s, i) => (
                <motion.tr 
                  key={i} 
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  style={{ borderBottom: i === sources.length - 1 ? 'none' : '1px solid var(--surface-border)', transition: 'background-color 0.2s' }}
                >
                  <td style={{ padding: '20px 24px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{s.title || s.url}</td>
                  <td style={{ padding: '20px 24px', fontSize: 15, color: 'var(--text-muted)' }}>{s.page_count}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{ 
                      background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
                      padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, 
                      display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(16, 185, 129, 0.2)' 
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                      ACTIVE
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

// Quick dummy import fix for Database icon missing from lucide import above
import { Database } from 'lucide-react';
