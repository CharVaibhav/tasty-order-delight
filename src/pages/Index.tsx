import React from 'react';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';

export const Index = () => {
  return (
    <>
      <HeroBanner />
      <main>
        <section id="menu-section" className="py-12 bg-background">
          <div className="container">
            <MenuPage hideLayout />
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
