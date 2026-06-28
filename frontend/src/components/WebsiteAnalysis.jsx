import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CheckCircle2, AlertTriangle, Users, BookOpen, ChevronRight, MessageSquare, Download } from 'lucide-react';

const WebsiteAnalysis = ({ analysis, onClose, onQuestionClick }) => {
  if (!analysis) return null;

  const handleDownload = () => {
    const report = `
AI WEBSITE INTELLIGENCE REPORT
==============================
Coverage Score: ${analysis.coverage_score}%
Target Audience: ${analysis.target_audience}

EXECUTIVE SUMMARY:
${analysis.executive_summary}

MAIN TOPICS:
${analysis.main_topics.map(t => `- ${t}`).join('\n')}

KNOWLEDGE GAPS:
${analysis.missing_information.map(t => `- ${t}`).join('\n')}

SUGGESTED QUESTIONS:
${analysis.suggested_questions.map(t => `- ${t}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website_analysis_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          style={{
            background: 'var(--card-bg)', border: '1px solid var(--surface-border)',
            borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '900px',
            maxHeight: '90vh', overflowY: 'auto', backdropFilter: 'blur(16px)',
            boxShadow: 'var(--surface-glow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
                <Sparkles style={{ width: 24, height: 24, color: 'var(--primary-color)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>AI Website Intelligence</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>Deep analysis of the ingested content</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleDownload} className="secondary" style={{ padding: '8px' }} title="Download Report">
                <Download style={{ width: 20, height: 20 }} />
              </button>
              <button onClick={onClose} className="secondary" style={{ padding: '8px' }} title="Close">
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', gridColumn: 'span 2' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
                  <BookOpen style={{ width: 20, height: 20, color: '#3b82f6' }} />
                  Executive Summary
                </h3>
                <p style={{ color: 'var(--text-color)', lineHeight: 1.6, margin: 0 }}>
                  {analysis.executive_summary}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', uppercase: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Main Topics</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.main_topics.map((topic, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-color)', fontSize: '14px' }}>
                        <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981', marginTop: '3px', flexShrink: 0 }} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', uppercase: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Knowledge Gaps</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.missing_information.map((gap, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-color)', fontSize: '14px' }}>
                        <AlertTriangle style={{ width: 16, height: 16, color: '#f59e0b', marginTop: '3px', flexShrink: 0 }} />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Coverage Score</h3>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{analysis.coverage_score}%</div>
                <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '999px', height: '8px', marginBottom: '8px' }}>
                  <div 
                    style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))', height: '8px', borderRadius: '999px', width: `${analysis.coverage_score}%` }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Estimated comprehensiveness</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users style={{ width: 16, height: 16 }} />
                  Target Audience
                </h3>
                <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '14px' }}>{analysis.target_audience}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
              <MessageSquare style={{ width: 20, height: 20, color: '#a855f7' }} />
              Suggested Questions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {analysis.suggested_questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onClose();
                    onQuestionClick(q);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textAlign: 'left', padding: '12px 16px', borderRadius: '8px',
                    background: 'var(--chat-suggestion-bg)', border: '1px solid var(--surface-border)',
                    color: 'var(--text-color)', fontSize: '14px', cursor: 'pointer',
                    transition: 'all 0.2s', width: '100%'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ paddingRight: '8px' }}>{q}</span>
                  <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WebsiteAnalysis;
