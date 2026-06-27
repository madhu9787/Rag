import { motion } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';

export function AnimatedRobot() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Glow Behind Robot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      {/* Floating Robot Body */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--surface-bg)',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          borderRadius: 60,
          padding: '50px 60px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3), inset 0 0 30px rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Antenna */}
        <motion.div
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: -40, width: 8, height: 40, background: 'var(--surface-border)', borderRadius: 4 }}
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ position: 'absolute', top: -14, left: -8, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 20px var(--accent-color)' }}
          />
        </motion.div>

        {/* Eyes */}
        <div style={{ display: 'flex', gap: 40, marginBottom: 30 }}>
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
            style={{ width: 50, height: 20, background: 'var(--primary-color)', borderRadius: 10, boxShadow: '0 0 20px var(--primary-color)' }}
          />
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
            style={{ width: 50, height: 20, background: 'var(--primary-color)', borderRadius: 10, boxShadow: '0 0 20px var(--primary-color)' }}
          />
        </div>

        {/* Mouth/Voice indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', height: 30 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [10, Math.random() * 30 + 10, 10] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              style={{ width: 8, background: 'var(--accent-color)', borderRadius: 4, boxShadow: '0 0 10px var(--accent-color)' }}
            />
          ))}
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: -25, right: -25, background: 'var(--surface-bg)', border: '2px solid rgba(139, 92, 246, 0.5)', padding: 16, borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
        >
          <Zap size={32} color="var(--primary-color)" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
