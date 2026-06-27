import { motion } from 'framer-motion';
import { Database, FileText, Settings, Search, MessageSquare, Zap, Network, Globe, FolderTree, Cpu, CheckCircle2, Workflow, Fingerprint, RefreshCcw, BrainCircuit, Boxes, Wand2, DatabaseZap, Bot, ScanLine, Webhook } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const dashAnimation = {
  animate: { 
    strokeDashoffset: [40, 0],
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

const steps = [
  {
    id: 1,
    title: "DATA ACQUISITION",
    date: "PHASE 01 | CRAWL",
    desc: "Distributed crawlers navigate websites, extract raw HTML, and convert it into clean text representations.",
    icon: <Globe size={18} color="#00f2fe" />,
    color: "#00f2fe", // Cyan
    tag: "Active",
    components: [
      { name: "Web Crawler" },
      { name: "API Ingestion" }
    ]
  },
  {
    id: 2,
    title: "SEMANTIC CHUNKING",
    date: "PHASE 02 | PROCESS",
    desc: "Content is intelligently split using structural and semantic boundaries to ensure no context is lost.",
    icon: <Boxes size={18} color="#b066ff" />,
    color: "#b066ff", // Purple
    tag: "Processing",
    components: [
      { name: "Markdown Converter" },
      { name: "Recursive Splitter" }
    ]
  },
  {
    id: 3,
    title: "VECTOR EMBEDDINGS",
    date: "PHASE 03 | EMBED",
    desc: "Chunks are processed through state-of-the-art embedding models to generate rich mathematical representations.",
    icon: <Wand2 size={18} color="#00f2fe" />,
    color: "#00f2fe", // Cyan
    tag: "Compute",
    components: [
      { name: "ONNX Runtime" },
      { name: "all-MiniLM-L6" }
    ]
  },
  {
    id: 4,
    title: "HIGH-SPEED INDEXING",
    date: "PHASE 04 | STORE",
    desc: "Vectors and metadata are persisted in a high-performance database optimized for similarity search.",
    icon: <DatabaseZap size={18} color="#b066ff" />,
    color: "#b066ff", // Purple
    tag: "Database",
    components: [
      { name: "ChromaDB" },
      { name: "HNSW Index" }
    ]
  },
  {
    id: 5,
    title: "HYBRID RETRIEVAL",
    date: "PHASE 05 | SEARCH",
    desc: "Queries use dense vector search combined with sparse keyword scoring for maximum accuracy and relevance.",
    icon: <Search size={18} color="#00f2fe" />,
    color: "#00f2fe", // Cyan
    tag: "Search",
    components: [
      { name: "Semantic Search" },
      { name: "BM25 Ranking" }
    ]
  },
  {
    id: 6,
    title: "CONTEXTUAL SYNTHESIS",
    date: "PHASE 06 | GENERATE",
    desc: "Retrieved context is injected into the LLM prompt. The model synthesizes a factual, hallucination-free response.",
    icon: <BrainCircuit size={18} color="#b066ff" />,
    color: "#b066ff", // Purple
    tag: "LLM",
    components: [
      { name: "Groq LLaMA-3" },
      { name: "AI Synthesis" }
    ]
  }
];

export function AnimatedArchitecture() {
  
  // Dimensions for the S-curve lines
  const rowHeight = 220;
  const nodeDistX = 300; 

  return (
    <section style={{ padding: '80px 20px', background: 'transparent', position: 'relative', overflow: 'hidden', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
         <motion.div 
           key={`p-${i}`}
           animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
           transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
           style={{
             position: 'absolute',
             top: `${Math.random() * 100}%`,
             left: `${Math.random() * 100}%`,
             width: Math.random() * 4 + 2,
             height: Math.random() * 4 + 2,
             borderRadius: '50%',
             background: i % 2 === 0 ? '#00f2fe' : '#b066ff',
             boxShadow: `0 0 10px ${i % 2 === 0 ? '#00f2fe' : '#b066ff'}`,
             zIndex: 1
           }}
         />
      ))}

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, marginBottom: 8, letterSpacing: '-1.5px', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}>
            <span>Project</span> <span style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Timeline</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 13, letterSpacing: 1, fontWeight: 600, fontFamily: 'var(--font-family)' }}>
            <span>ACTIVITY FEED</span>
            <Settings size={14} />
          </div>
        </div>

        {/* Timeline Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
        >
          
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0; // Card on left, Node on right
            
            return (
              <div key={step.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: rowHeight, width: '100%' }}>
                
                {/* SVG Curve to next node (except for last item) */}
                {index < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 0 }}>
                    <svg style={{ position: 'absolute', overflow: 'visible', left: isLeft ? nodeDistX/2 : -nodeDistX/2, top: 0 }}>
                       <defs>
                         <linearGradient id={`grad-${index}`} x1="0" y1="0" x2={isLeft ? "-1" : "1"} y2="1">
                           <stop offset="0%" stopColor={step.color} />
                           <stop offset="100%" stopColor={steps[index+1].color} />
                         </linearGradient>
                         <filter id={`glow-${index}`}>
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                         </filter>
                       </defs>
                       <motion.path 
                          // M 0 0 -> start at current node
                          // C 0 H/2, W H/2, W H -> curve to next node
                          d={`M 0 0 C 0 ${rowHeight/2}, ${isLeft ? -nodeDistX : nodeDistX} ${rowHeight/2}, ${isLeft ? -nodeDistX : nodeDistX} ${rowHeight}`}
                          fill="none"
                          stroke={`url(#grad-${index})`}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                          filter={`url(#glow-${index})`}
                          variants={dashAnimation}
                          animate="animate"
                       />
                    </svg>
                  </div>
                )}

                {/* Card */}
                <motion.div 
                  variants={cardVariants} 
                  style={{ 
                    position: 'absolute',
                    [isLeft ? 'right' : 'left']: `calc(50% - ${nodeDistX/2 - 40}px)`,
                    width: 380,
                    zIndex: 10
                  }}
                >
                  <div style={{ 
                    background: 'rgba(20, 20, 30, 0.65)', 
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 1px 10px rgba(255,255,255,0.03)',
                    position: 'relative'
                  }}>
                    {/* Speech Bubble Arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      [isLeft ? 'right' : 'left']: -7,
                      transform: 'translateY(-50%) rotate(45deg)',
                      width: 14,
                      height: 14,
                      background: 'rgba(20, 20, 30, 0.9)',
                      borderTop: isLeft ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      borderRight: isLeft ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      borderBottom: !isLeft ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      borderLeft: !isLeft ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      backdropFilter: 'blur(16px)'
                    }} />

                    {/* Card Content */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.5, fontWeight: 500 }}>{step.date}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: step.color, fontWeight: 600 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.color, boxShadow: `0 0 8px ${step.color}` }} />
                        {step.tag}
                      </div>
                    </div>
                    
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: 0.5 }}>{step.title}</h3>
                    <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{step.desc}</p>
                    
                    {/* Progress bar or tags */}
                    <div style={{ display: 'flex', gap: 8 }}>
                       {step.components.map((c, i) => (
                         <div key={i} style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, color: '#94a3b8', fontWeight: 600 }}>
                           {c.name}
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>

                {/* Node Orb */}
                <div style={{ 
                  position: 'absolute', 
                  left: `calc(50% ${isLeft ? '+' : '-'} ${nodeDistX/2}px)`, 
                  transform: 'translateX(-50%)',
                  zIndex: 20 
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#0a0a0f',
                    border: `3px solid ${step.color}`,
                    boxShadow: `0 0 15px ${step.color}, inset 0 0 8px ${step.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.color, boxShadow: `0 0 10px ${step.color}` }} />
                  </div>
                </div>

              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
