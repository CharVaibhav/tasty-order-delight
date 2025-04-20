import React from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground = () => {
  // Generate random particles with more visible properties
  const particles = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3, // Larger size (3-11px)
    duration: Math.random() * 15 + 10, // Animation speed
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // Stronger glow effect
            opacity: 0.1, // Start with low opacity
          }}
          animate={{
            x: [
              `${particle.x}%`, 
              `${particle.x + (Math.random() * 20 - 10)}%`,
              `${particle.x - (Math.random() * 20 - 10)}%`,
              `${particle.x}%`
            ],
            y: [
              `${particle.y}%`, 
              `${particle.y - (Math.random() * 20 - 10)}%`,
              `${particle.y + (Math.random() * 20 - 10)}%`,
              `${particle.y}%`
            ],
            opacity: [0.1, 0.8, 0.8, 0.1], // More dramatic opacity change
            scale: [0.8, 1.2, 1.2, 0.8], // Add scaling for more visibility
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
      ))}
    </div>
  );
}; 