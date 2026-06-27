import { Settings as SettingsIcon, Shield, Bell, Moon, User, Server } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

export function Settings() {
  const { userName, setUserName } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: 860, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 16 }}>Manage your AI workspace preferences.</p>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Profile */}
        <motion.section variants={itemVariants} style={{ background: 'var(--card-bg)', border: '1px solid var(--surface-border)', padding: 32, borderRadius: 24, boxShadow: 'var(--surface-glow)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--surface-border)', paddingBottom: 16 }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 10, borderRadius: 12, color: 'var(--primary-color)' }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Profile</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>How the AI addresses you</p>
            </div>
          </div>
          
          <div className="input-group" style={{ maxWidth: 400 }}>
            <label style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>Display Name</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="e.g. Alex"
              style={{ marginTop: 4 }}
            />
          </div>
        </motion.section>

        {/* AI Preferences */}
        <motion.section variants={itemVariants} style={{ background: 'var(--card-bg)', border: '1px solid var(--surface-border)', padding: 32, borderRadius: 24, boxShadow: 'var(--surface-glow)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--surface-border)', paddingBottom: 16 }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12, color: 'var(--success-color)' }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>AI Guardrails</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>Control how the AI retrieves and validates data</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Strict Citation Mode</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>AI must cite sources for every factual claim.</div>
              </div>
              <div style={{ width: 44, height: 24, background: 'var(--primary-color)', borderRadius: 12, position: 'relative', cursor: 'pointer', boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)' }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 10, position: 'absolute', top: 2, right: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Web Search Fallback</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Allow AI to search the public web if knowledge base lacks an answer.</div>
              </div>
              <div style={{ width: 44, height: 24, background: 'var(--input-border)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 10, position: 'absolute', top: 2, left: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
              </div>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
