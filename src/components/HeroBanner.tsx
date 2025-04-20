import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { ParticleBackground } from './ParticleBackground';

export const HeroBanner = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      const headerHeight = 64; // Height of the fixed header
      const y = menuSection.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-r from-food-orange/20 to-gray-900/30 dark:from-food-orange/10 dark:to-gray-900/70">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-8 text-center"
        >
          <div className="h-24 flex items-center justify-center">
            <TypeAnimation
              sequence={[
                "Hungry?",
                1000,
                "Craving something delicious?",
                1000,
                "Looking for the perfect meal?",
                1000,
              ]}
              wrapper="h2"
              speed={50}
              className="text-4xl md:text-5xl font-bold text-food-orange dark:text-food-orange"
              repeat={Infinity}
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Discover our mouthwatering selection of dishes, crafted with love and
            served with care. Your perfect meal is just a click away.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={scrollToMenu}
              size="lg"
              className="relative bg-white/10 backdrop-blur-md border border-white/20 text-food-orange dark:text-food-orange px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 dark:hover:bg-white/5"
            >
              <span className="relative z-10">Browse Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-food-orange/20 to-food-orange/10 dark:from-food-orange/10 dark:to-transparent rounded-full blur-sm"></div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 