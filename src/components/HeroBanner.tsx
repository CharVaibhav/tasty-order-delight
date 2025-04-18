import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';

export const HeroBanner = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      const yOffset = -80; // Account for header height
      const y = menuSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[50vh] bg-gradient-to-r from-food-orange/10 to-food-orange/5 dark:from-food-orange/5 dark:to-gray-900/50">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="h-24 flex items-center justify-center">
            <TypeAnimation
              sequence={[
                'Let\'s Kill Your Hunger',
                2000,
                'Cravings?',
                2000,
                'Hey, we missed you!!',
                2000,
              ]}
              wrapper="h2"
              speed={50}
              repeat={Infinity}
              className="text-4xl md:text-5xl font-bold text-food-orange dark:text-food-orange"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={scrollToMenu}
              size="lg"
              className="bg-food-orange hover:bg-food-orange-dark text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 