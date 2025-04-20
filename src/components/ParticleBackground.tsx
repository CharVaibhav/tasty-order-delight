import React from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground = () => {
  // Generate random particles that move around
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2, // Size between 2-7px
    duration: Math.random() * 20 + 15, // Slower animation for more natural movement
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white dark:bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.7)',
          }}
          animate={{
            x: [
              `${particle.x}%`,
              `${particle.x + (Math.random() * 10 - 5)}%`,
              `${particle.x + (Math.random() * 10 - 5)}%`,
              `${particle.x}%`,
            ],
            y: [
              `${particle.y}%`,
              `${particle.y + (Math.random() * 10 - 5)}%`,
              `${particle.y + (Math.random() * 10 - 5)}%`,
              `${particle.y}%`,
            ],
            opacity: [0.3, 0.7, 0.7, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}; 