import { useState, useCallback } from 'react';
import { api } from '../lib/api';

export function useIngest(onSuccess) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState(null);

  const pollStatus = useCallback(async (jobId) => {
    try {
      const data = await api.getIngestStatus(jobId);
      setStatus(data);

      // Flip "ready" as soon as first page is indexed — enable chat immediately
      if (data.is_ready && !isReady) {
        setIsReady(true);
        if (data.source_id) setActiveSourceId(data.source_id);
      }

      if (data.status === 'completed') {
        setIsIngesting(false);
        if (data.source_id) setActiveSourceId(data.source_id);
        if (onSuccess) onSuccess();
      } else if (data.status === 'failed') {
        setIsIngesting(false);
        setError(data.error || 'Ingestion failed');
      } else {
        // Continue polling every 1 second for responsive progress updates
        setTimeout(() => pollStatus(jobId), 1000);
      }
    } catch (err) {
      console.error(err);
      setIsIngesting(false);
      setError('Failed to poll status');
    }
  }, [onSuccess, isReady]);

  const submitUrl = async (url, maxDepth, maxPages) => {
    setIsIngesting(true);
    setIsReady(false);
    setActiveSourceId(null);
    setError(null);
    setStatus(null);

    try {
      const data = await api.ingestUrl(url, maxDepth, maxPages);
      // source_id is available immediately from the POST response
      if (data.source_id) setActiveSourceId(data.source_id);
      pollStatus(data.job_id);
    } catch (err) {
      setError(err.message);
      setIsIngesting(false);
    }
  };

  return { submitUrl, status, error, isIngesting, isReady, activeSourceId };
}
