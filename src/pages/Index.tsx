
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';
import { useCart } from '@/lib/context/CartContext';

export const Index = () => {
  const { items, addItem, removeItem, updateQuantity } = useCart();

  return (
    <Layout>
      <HeroBanner />
      <main>
        <section id="menu-section" className="py-12 bg-background">
          <div className="container">
            <MenuPage hideLayout />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;
