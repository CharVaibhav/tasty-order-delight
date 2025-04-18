import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';

const Index = () => {
  return (
    <Layout>
      <main>
        <HeroBanner />
        <section id="menu-section" className="pt-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-food-gray-dark dark:text-gray-100 mb-2">Our Menu</h1>
            <p className="text-food-gray dark:text-gray-300 mb-8">Discover our delicious dishes</p>
            <MenuPage hideLayout={true} />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;
