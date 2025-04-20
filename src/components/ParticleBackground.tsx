import React from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground = () => {
  // Generate more particles with better visibility
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 4, // Increased size (4-14px)
    duration: Math.random() * 15 + 10, // Slightly faster animation
    delay: Math.random() * 5, // Add random delay for more natural effect
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white dark:bg-white" // White color for better visibility
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)', // Enhanced glow effect
          }}
          initial={{ 
            y: '-10%', 
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            y: ['0%', '100%'],
            opacity: [0, 0.9, 0], // Higher max opacity
            scale: [0.8, 1.2, 0.8], // Add subtle scaling effect
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}; 