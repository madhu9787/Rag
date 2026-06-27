import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sun, BookOpen, Code, Sparkles, ShieldCheck, Zap, LineChart, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedTerminal } from '../components/AnimatedTerminal';
import { AnimatedArchitecture } from '../components/AnimatedArchitecture';
import { AnimatedRobot } from '../components/AnimatedRobot';

export function Landing() {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-grid" style={{ minHeight: '100vh', background: 'var(--bg-gradient)', color: 'var(--text-color)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Flat Grid Background with Sparkling Nodes */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Flat Grid */}
        <div style={{ 
          position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', 
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)', 
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center'
        }} />
        
        {/* Animated Sparkling Stars/Nodes moving in random directions */}
        {[...Array(25)].map((_, i) => {
          // Starting coordinates
          const startX = Math.floor(Math.random() * 30) * (100/30);
          const startY = Math.floor(Math.random() * 20) * (100/20);
          
          return (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 0.8, 1, 0.8, 0],
                scale: [0.5, 1.2, 0.8, 1.5, 0.5],
                x: [0, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 300],
                y: [0, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 300],
                rotate: [0, 90, 180]
              }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: `${startY}%`,
                left: `${startX}%`,
                width: 14,
                height: 14,
                background: 'var(--landing-particle)',
                clipPath: 'polygon(50% 0%, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0% 50%, 45% 45%)',
                filter: 'var(--landing-particle-shadow)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}

        {/* Moving glowing gradient overlay to simulate light sweeping across the grid */}
        <motion.div
          animate={{ x: ['-100vw', '200vw'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50vw',
            height: '100vh',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.04), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        
        {/* Subtle radial gradient to darken edges so text is super readable */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'var(--landing-overlay-grad)'
        }} />
      </div>

      {/* Sticky Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '20px 48px', backdropFilter: 'blur(12px)', 
          borderBottom: '1px solid var(--surface-border)', 
          position: 'sticky', top: 0, zIndex: 100, background: 'var(--nav-bg)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}>
            <LineChart size={20} color="var(--landing-text)" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>RAG Intelligence System</span>
        </div>
        
        <div className="landing-nav-links">
          <span onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', color: 'var(--landing-text)', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--landing-text)'}>
            <BookOpen size={16} color="var(--primary-color)" fill="var(--primary-color)" /> About
          </span>
          <span onClick={() => document.getElementById('how-to-use-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--landing-text-muted)'}>
            <Code size={16} color="var(--accent-color)" fill="var(--accent-color)" /> How to Use
          </span>
          <span onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--landing-text-muted)'}>
            <Sparkles size={16} color="var(--primary-color)" fill="var(--primary-color)" /> Features
          </span>
          <span onClick={() => document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--landing-text-muted)'}>
            <ShieldCheck size={16} color="var(--accent-color)" fill="var(--accent-color)" /> Why & How It Works
          </span>
        </div>
        
        <div className="landing-nav-actions">
          <button onClick={toggleTheme} style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {theme === 'light' ? <Moon size={20} color="#3b82f6" /> : <Sun size={20} color="#eab308" fill="#eab308" />} 
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'var(--text-color)', color: 'var(--bg-color)', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              <LayoutDashboard size={16} /> Open Dashboard
            </motion.button>
          </Link>
        </div>
      </motion.nav>

            {/* Floating Animated Robot */}
      <motion.div
        animate={{ 
          x: ['-20vw', '110vw'], 
          y: ['20vh', '40vh', '15vh', '50vh', '20vh'],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.4,
        }}
      >
        <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }}>
          <AnimatedRobot />
        </div>
      </motion.div>

      {/* Full-Screen Split Hero */}
      <div className="landing-hero-container">
        <div className="landing-hero-grid">
          
          {/* Left Side: Copy */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid var(--surface-border)', padding: '6px 14px', borderRadius: 20, fontSize: 13, color: 'var(--landing-text-muted)', marginBottom: 32, fontWeight: 600, width: 'fit-content' }}>
              <Zap size={14} color="var(--primary-color)" />
              AI-Powered Website Ingestion
            </motion.div>
            
            <motion.h1 variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', fontSize: 'clamp(40px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, margin: '0 0 16px 0', color: 'var(--landing-text)', fontFamily: 'var(--font-family)' }}>
              <span>Turn any website into</span>
              <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content' }}>an intelligent knowledge base.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} style={{ fontSize: 16, color: 'var(--landing-text-muted)', margin: '0 0 32px 0', lineHeight: 1.6, fontWeight: 500, maxWidth: 500, textAlign: 'left', fontFamily: 'var(--font-family)' }}>
              Ingest your documentation, websites, and data sources. RAG Intelligence System correlates content, runs AI-powered vector search, and returns highly detailed answers with instant source citations.
            </motion.p>
            
            <motion.div variants={fadeUp}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px var(--primary-color)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'var(--primary-color)', color: 'white', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)', border: 'none' }}
                >
                  <Zap size={16} /> Get Started
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

                    {/* Right Side: Animated Terminal */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
          >
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <AnimatedTerminal />
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* About Section */}
      <div id="about-section" style={{ padding: '120px 80px', position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '6px 16px', borderRadius: 20, fontSize: 13, color: 'var(--landing-text-muted)', marginBottom: 24, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            <BookOpen size={14} color="var(--primary-color)" /> About Us
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-family)', letterSpacing: '-1.5px', color: 'var(--landing-text)', lineHeight: 1.2 }}>
            Empowering your data with <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contextual AI</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ color: 'var(--landing-text-muted)', fontSize: 18, margin: '0 auto 40px auto', lineHeight: 1.8, fontFamily: 'var(--font-family)', maxWidth: 800 }}>
            We believe that finding answers in your company's data shouldn't require manual searching. Our platform autonomously crawls your knowledge bases, parses unstructured information, and utilizes advanced Large Language Models (LLMs) combined with dense vector retrieval (RAG) to deliver instantaneous, accurate, and perfectly sourced answers to your most complex questions.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
             <motion.div whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)' }} style={{ background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '24px', borderRadius: '16px', width: '250px', cursor: 'default' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-color)', marginBottom: 8, fontFamily: 'var(--font-family)' }}>10x</div>
                <div style={{ fontSize: 14, color: 'var(--landing-text-muted)', fontWeight: 500 }}>Faster Information Retrieval</div>
             </motion.div>
             <motion.div whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)' }} style={{ background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '24px', borderRadius: '16px', width: '250px', cursor: 'default' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-color)', marginBottom: 8, fontFamily: 'var(--font-family)' }}>100%</div>
                <div style={{ fontSize: 14, color: 'var(--landing-text-muted)', fontWeight: 500 }}>Automated Knowledge Indexing</div>
             </motion.div>
             <motion.div whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)' }} style={{ background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '24px', borderRadius: '16px', width: '250px', cursor: 'default' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-color)', marginBottom: 8, fontFamily: 'var(--font-family)' }}>0</div>
                <div style={{ fontSize: 14, color: 'var(--landing-text-muted)', fontWeight: 500 }}>Hallucinations (Factual RAG)</div>
             </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Industries Section */}
      <div style={{ padding: '60px 0 120px 0', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 80px' }}>
          <div style={{ color: '#f97316', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-family)' }}>Use Cases for Every Team</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: 'var(--landing-text)', fontFamily: 'var(--font-family)', letterSpacing: '-1px' }}>Turn your enterprise knowledge into actionable intelligence</h2>
        </div>
        
        <div style={{ display: 'flex', gap: 24, padding: '0 80px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           {/* Card 1 */}
           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -10, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.7)' }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ minWidth: 280, height: 380, borderRadius: 20, position: 'relative', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
             <img src="/images/devops.png" alt="DevOps Engineers" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)' }}>
               <h3 style={{ margin: 0, color: 'var(--landing-text)', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '1px' }}>SOFTWARE ENGINEERING</h3>
             </div>
           </motion.div>
           
           {/* Card 2 */}
           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -10, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.7)' }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ minWidth: 280, height: 380, borderRadius: 20, position: 'relative', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
             <img src="/images/support.png" alt="Customer Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)' }}>
               <h3 style={{ margin: 0, color: 'var(--landing-text)', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '1px' }}>CUSTOMER SUPPORT</h3>
             </div>
           </motion.div>
           
           {/* Card 3 */}
           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -10, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.7)' }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ minWidth: 280, height: 380, borderRadius: 20, position: 'relative', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
             <img src="/images/research.png" alt="Research Analysts" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)' }}>
               <h3 style={{ margin: 0, color: 'var(--landing-text)', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '1px' }}>RESEARCH ANALYSTS</h3>
             </div>
           </motion.div>
           
           {/* Card 4 */}
           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ y: -10, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.7)' }} viewport={{ once: true }} transition={{ delay: 0.4 }} style={{ minWidth: 280, height: 380, borderRadius: 20, position: 'relative', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
             <img src="/images/legal.png" alt="Legal Teams" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)' }}>
               <h3 style={{ margin: 0, color: 'var(--landing-text)', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '1px' }}>LEGAL PROFESSIONALS</h3>
             </div>
           </motion.div>
        </div>
      </div>

      {/* How to Use Section */}
      <div id="how-to-use-section" style={{ padding: '100px 80px', position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, fontFamily: 'var(--font-family)', letterSpacing: '-1px', color: 'var(--landing-text)' }}>
              How to <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Use</span>
            </motion.h2>
            <p style={{ color: 'var(--landing-text-muted)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Get your intelligent knowledge base up and running in three simple steps.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Connect Data', desc: 'Paste a website URL or upload your PDF documentation. The system automatically handles crawling and text extraction.' },
              { step: '02', title: 'AI Processing', desc: 'We intelligently chunk your content, generate embeddings, and index it into a high-performance vector database.' },
              { step: '03', title: 'Query & Chat', desc: 'Ask complex questions. The LLM retrieves the most relevant chunks and synthesizes an answer with exact citations.' }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -5, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)' }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: 40, borderRadius: 24, position: 'relative', overflow: 'hidden', cursor: 'default' }}>
                <div style={{ fontSize: 80, fontWeight: 900, color: 'var(--landing-card-bg)', position: 'absolute', top: -10, right: -10, lineHeight: 1 }}>{item.step}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--landing-text)', marginBottom: 16, fontFamily: 'var(--font-family)' }}>{item.title}</div>
                <p style={{ color: 'var(--landing-text-muted)', fontSize: 16, lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" style={{ padding: '100px 80px', position: 'relative', zIndex: 10, background: 'transparent' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, fontFamily: 'var(--font-family)', letterSpacing: '-1px', color: 'var(--landing-text)' }}>
              Powerful <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Features</span>
            </motion.h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
            {[
              'Advanced Semantic Chunking & Parsing',
              'Real-time Web Crawling & Ingestion',
              'Sub-millisecond Vector Search Retrieval',
              'Factual Answers with Source Citations',
              'Interactive Terminal & Architecture Views',
              'Fully Responsive Premium UI'
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.4)' }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '20px 24px', borderRadius: 16, cursor: 'default' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span style={{ color: 'var(--landing-text)', fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-family)' }}>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Pipeline / Architecture Section */}
      <div id="timeline-section">
        <AnimatedArchitecture />
      </div>

      {/* CTA Section */}
      <div style={{ padding: '100px 80px', position: 'relative', zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          whileHover={{ boxShadow: '0 0 50px rgba(139, 92, 246, 0.6)' }}
          style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 32, overflow: 'hidden', position: 'relative', background: '#111', height: 450, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'box-shadow 0.3s' }}
        >
          <img src="/images/cta.png" alt="CTA Background" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, filter: 'brightness(0.6)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))', zIndex: 1 }} />
          
          <div style={{ position: 'relative', zIndex: 2, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-color)', padding: 16, borderRadius: 16, marginBottom: 24, boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}>
              <Zap size={32} color="white" />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: 'var(--landing-text)', margin: '0 0 16px 0', fontFamily: 'var(--font-family)', letterSpacing: '-1px' }}>
              Ready to unlock your enterprise knowledge?
            </h2>
            <p style={{ color: 'var(--landing-text-muted)', fontSize: 20, maxWidth: 600, margin: '0 0 40px 0', fontWeight: 500 }}>
              Upload your unstructured data and get instant, confidence-ranked answers in seconds.
            </p>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'var(--font-family)' }}
              >
                <Zap size={20} /> Open Dashboard Now
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer style={{ padding: '80px 80px 40px', position: 'relative', zIndex: 10, borderTop: '1px solid var(--landing-card-border)', marginTop: 40, background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 60, marginBottom: 80 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineChart size={20} color="var(--landing-text)" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif', color: 'var(--landing-text)' }}>RAG</span>
            </div>
            <p style={{ color: 'var(--landing-text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Shorten your incident resolution time with intelligent root cause analysis and confident correlation.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--landing-text)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, fontFamily: 'var(--font-family)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--landing-text-muted)', fontSize: 15, fontWeight: 500 }}>
              <Link to="/dashboard" style={{ color: 'var(--landing-text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>Dashboard</Link>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>History</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>Analysis</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--landing-text)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, fontFamily: 'var(--font-family)' }}>Learn About</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--landing-text-muted)', fontSize: 15, fontWeight: 500 }}>
              <span onClick={() => document.getElementById('how-to-use-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>How to Use</span>
              <span onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>Features</span>
              <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-color)'} onMouseOut={(e) => e.target.style.color = 'var(--landing-text-muted)'}>Services</span>
            </div>
          </div>

          <div style={{ flex: 1.5 }}>
            <h4 style={{ color: 'var(--landing-text)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, fontFamily: 'var(--font-family)' }}>Frequently Asked Questions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { q: 'What files do I need to upload?', a: 'You can upload PDF, DOCX, TXT, and CSV files, or simply provide a website URL.' },
                { q: 'How does the AI correlate data?', a: 'We use advanced embedding models to map unstructured text into a vector space, ensuring highly accurate semantic retrieval.' },
                { q: 'Is my information secure?', a: 'Yes, all data is encrypted at rest and in transit. We do not use your private data to train our foundational models.' }
              ].map((faq, i) => (
                <motion.div 
                  key={i} 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }} 
                  style={{ background: 'var(--landing-card-bg)', border: '1px solid var(--landing-card-border)', padding: '16px 20px', borderRadius: 8, color: 'var(--landing-text)', display: 'flex', flexDirection: 'column', cursor: 'pointer', fontFamily: 'var(--font-family)', overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600 }}>
                    <span>{faq.q}</span>
                    <motion.span animate={{ rotate: activeFaq === i ? 90 : 0 }} style={{ color: 'var(--landing-text)' }}>&gt;</motion.span>
                  </div>
                  <motion.div 
                    initial={false}
                    animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0, marginTop: activeFaq === i ? 12 : 0 }}
                    style={{ overflow: 'hidden', color: 'var(--landing-text-muted)', fontSize: 13, lineHeight: 1.6 }}
                  >
                    {faq.a}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
        
        <div style={{ maxWidth: 1400, margin: '0 auto', borderTop: '1px solid var(--landing-card-border)', paddingTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LineChart size={20} color="var(--landing-text)" />
          </div>
          <div style={{ color: 'var(--landing-text-muted)', fontSize: 14, fontWeight: 500 }}>
            © 2026 RAG Intelligence System. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--landing-text-muted)', fontSize: 13, fontWeight: 600 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
            Service Online
          </div>
        </div>
      </footer>

    </div>
  );
}
