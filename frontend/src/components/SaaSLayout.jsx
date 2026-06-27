import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Database, MessageSquare, LineChart, Settings, Search, Bell, User, Menu, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function SaaSLayout() {
  const { userName } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Knowledge Base', icon: <Database size={20} />, path: '/workspace' },
    { name: 'Analytics', icon: <LineChart size={20} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="saas-layout-wrapper">
      
      {/* Global Flat Grid Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', 
          backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)', 
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(circle at center, transparent 0%, var(--page-bg) 100%)',
          opacity: 0.8
        }} />
      </div>
      
      
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar Navigation */}
      <aside className={`saas-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 8px 32px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>Nexus AI</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', padding: '0 8px', marginBottom: 8 }}>Overview</div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => `saas-nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, 
                fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div style={{ marginTop: 'auto', padding: 12, background: 'rgba(79, 70, 229, 0.05)', borderRadius: 8, border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{userName}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pro Plan</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="saas-main">
        
        {/* Top Navbar */}
        <header style={{ height: 64, borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--surface-bg)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
          <button className="mobile-header-toggle" onClick={toggleMobileMenu}>
            <Menu size={24} color="var(--text-color)" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', width: 400, background: 'rgba(79, 70, 229, 0.05)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--surface-border)' }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: 8 }} />
            <input type="text" placeholder="Search commands or files... (Cmd+K)" style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', fontSize: 13, width: '100%', outline: 'none' }} disabled />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 10 }}>
          <Outlet />
        </div>
      </main>

    </div>
  );
}
