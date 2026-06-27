import { Activity, Cpu, Database } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export function Analytics() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('http://localhost:8000/api/analytics/usage');
        if (res.ok) {
          const data = await res.json();
          setChartData(data.usage);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const totalRequests = chartData.reduce((sum, day) => sum + day.requests, 0);

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Analytics & Usage</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Monitor your AI query volume and ingestion performance.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'var(--text-muted)' }}>
            <Activity size={18} /> API Requests (7d)
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{isLoading ? '...' : totalRequests}</div>
          <div style={{ fontSize: 13, color: 'var(--success-color)', marginTop: 8 }}>Real-time usage</div>
        </div>
        <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'var(--text-muted)' }}>
            <Cpu size={18} /> Avg Inference Time
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>840ms</div>
          <div style={{ fontSize: 13, color: 'var(--success-color)', marginTop: 8 }}>Optimized ONNX Runtime</div>
        </div>
        <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'var(--text-muted)' }}>
            <Database size={18} /> Storage Used
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>45 MB</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>ChromaDB Vector Store</div>
        </div>
      </div>

      <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: 32, borderRadius: 16, height: 400, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>API Requests (Last 7 Days)</h3>
        <div style={{ flex: 1, width: '100%' }}>
          {isLoading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="pulse" style={{ color: 'var(--text-muted)' }}>Loading analytics...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--grid-color)' }}
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--surface-border)', borderRadius: 8, color: 'var(--text-primary)' }}
                />
                <Bar dataKey="requests" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
