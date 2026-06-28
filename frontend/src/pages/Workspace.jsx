import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UrlIngestForm } from '../components/UrlIngestForm';
import { CrawlStatus } from '../components/CrawlStatus';
import { SourcesList } from '../components/SourcesList';
import { ChatPanel } from '../components/ChatPanel';
import { useIngest } from '../hooks/useIngest';
import { useSources } from '../hooks/useSources';
import { useChat } from '../hooks/useChat';
import { Globe } from 'lucide-react';
import WebsiteAnalysis from '../components/WebsiteAnalysis';
import { api } from '../lib/api';

export function Workspace() {
  const location = useLocation();
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [analyzingSourceId, setAnalyzingSourceId] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (location.state?.sourceId) {
      setSelectedSourceId(location.state.sourceId);
    }
  }, [location.state?.sourceId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    sources,
    isLoading: isSourcesLoading,
    fetchSources,
    deleteSource
  } = useSources();

  const {
    submitUrl,
    status: ingestStatus,
    isIngesting,
    isReady,
    activeSourceId,
  } = useIngest(() => {
    fetchSources();
  });

  const {
    messages,
    isStreaming,
    error: chatError,
    sendMessage
  } = useChat();

  useEffect(() => {
    if (activeSourceId && !selectedSourceId && !location.state?.sourceId) {
      setSelectedSourceId(activeSourceId);
    }
  }, [activeSourceId, selectedSourceId, location.state?.sourceId]);

  useEffect(() => {
    if (location.state?.initialQuestion && isReady) {
      handleSendMessage(location.state.initialQuestion);
      // clear state so it doesn't fire again on reload
      window.history.replaceState({}, document.title)
    }
  }, [location.state?.initialQuestion, isReady]);

  useEffect(() => {
    if (ingestStatus?.status === 'completed') {
      showToast('Website indexing completed successfully!', 'success');
    } else if (ingestStatus?.status === 'failed') {
      showToast(`Indexing failed: ${ingestStatus.error || 'Unknown error'}`, 'error');
    }
  }, [ingestStatus?.status]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const chatEnabled = sources.length > 0 || isReady;

  const handleSendMessage = (text) => {
    const sourceIds = selectedSourceId ? [selectedSourceId] : null;
    sendMessage(text, sourceIds);
  };

  const handleAnalyze = async (sourceId) => {
    setIsAnalyzing(true);
    setAnalyzingSourceId(sourceId);
    try {
      const data = await api.analyzeWebsite(sourceId);
      setAnalysisData(data);
    } catch (e) {
      showToast("Failed to analyze website", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedSourceId(analyzingSourceId); // switch to the source being analyzed
    handleSendMessage(question);
  };

  const toastUI = toast ? (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
      color: 'white', padding: '12px 20px', borderRadius: 8,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(8px)'
    }}>
      {toast.type === 'success' ? (
        <svg style={{width: 20, height: 20}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg style={{width: 20, height: 20}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span style={{fontWeight: 500, fontSize: 14}}>{toast.message}</span>
    </div>
  ) : null;

  return (
    <div className="workspace-wrapper">
      
      {/* Left Sidebar (Workspace Management) */}
      <div className="workspace-sidebar">
        <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Globe size={20} color="var(--primary-color)" /> Knowledge Base
        </h2>
        
        <UrlIngestForm
          onSubmit={submitUrl}
          isIngesting={isIngesting}
          isReady={isReady}
        />

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SourcesList
            sources={sources}
            isLoading={isSourcesLoading}
            onDelete={deleteSource}
            onSelect={setSelectedSourceId}
            onAnalyze={handleAnalyze}
            selectedId={selectedSourceId}
            isAnalyzing={isAnalyzing}
            analyzingSourceId={analyzingSourceId}
          />

          <CrawlStatus status={ingestStatus} />
        </div>
      </div>

      {/* Right Content (Chat Interface) */}
      <div className="workspace-chat-area">
        {selectedSourceId && (
          <div className="source-filter-badge">
            <svg style={{width: 16, height: 16, marginRight: 8}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Searching only within selected source:
            <span style={{fontWeight: 600, marginLeft: 4}}>
              {sources.find(s => s.id === selectedSourceId)?.title || 'New source (indexing…)'}
            </span>
            <button
              onClick={() => setSelectedSourceId(null)}
              style={{marginLeft: 'auto', background: 'transparent', padding: 4}}
            >
              <svg style={{width: 16, height: 16}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <ChatPanel
          messages={messages}
          isStreaming={isStreaming}
          error={chatError}
          onSendMessage={handleSendMessage}
          hasSources={chatEnabled}
        />
      </div>

      {analysisData && (
        <WebsiteAnalysis 
          analysis={analysisData} 
          onClose={() => setAnalysisData(null)}
          onQuestionClick={handleQuestionClick}
        />
      )}

      {toastUI}
    </div>
  );
}
