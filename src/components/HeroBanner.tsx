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
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5">
      <ParticleBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
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
              className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-foreground"
              repeat={Infinity}
            />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Discover our mouthwatering selection of dishes, crafted with love and
            served with care. Your perfect meal is just a click away.
          </p>
          <Button
            size="lg"
            onClick={scrollToMenu}
            className="transform hover:scale-105 transition-transform"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    </section>
  );
}; 