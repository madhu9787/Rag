const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = {
  async ingestUrl(url, maxDepth = 2, maxPages = 50) {
    const res = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, max_depth: maxDepth, max_pages: maxPages }),
    });
    if (!res.ok) throw new Error('Failed to start ingestion');
    return res.json();
  },

  async getIngestStatus(jobId) {
    const res = await fetch(`${API_BASE}/ingest/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },

  async getSources() {
    const res = await fetch(`${API_BASE}/sources`);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async deleteSource(sourceId) {
    const res = await fetch(`${API_BASE}/sources/${sourceId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete source');
    return res.json();
  },

  streamChat(question, sourceIds, onEvent) {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, source_ids: sourceIds?.length ? sourceIds : null }),
      })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          return reject(new Error(err.detail || 'Chat request failed'));
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n\r?\n/);
          buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer

          for (const line of lines) {
            if (!line.trim()) continue;
            const eventMatch = line.match(/^event: (.*)/);
            const dataMatch = line.match(/data: (.*)/);
            
            if (eventMatch && dataMatch) {
              const eventName = eventMatch[1].trim();
              const eventData = JSON.parse(dataMatch[1].trim());
              onEvent(eventName, eventData);
              if (eventName === 'done' || eventName === 'error') {
                resolve();
              }
            }
          }
        }
      })
      .catch(reject);
    });
  }
};
