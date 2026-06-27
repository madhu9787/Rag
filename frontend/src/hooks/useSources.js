import { useState, useCallback } from 'react';
import { api } from '../lib/api';

export function useSources() {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getSources();
      setSources(data.sources || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSource = async (id) => {
    try {
      await api.deleteSource(id);
      setSources(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { sources, isLoading, error, fetchSources, deleteSource };
}
