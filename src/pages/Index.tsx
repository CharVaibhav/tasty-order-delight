
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import { useCart } from '@/lib/context/CartContext';
import { menuItems } from '@/data/menuData';

export const Index = () => {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const popularItems = menuItems.filter(item => item.category === "Main Dishes");

  return (
    <Layout>
      <HeroBanner />
      <main>
        <section className="py-12 bg-background">
          <div className="container">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-foreground mb-6">
              Popular Dishes
            </h2>
            <PopularItemsMarquee 
              items={popularItems}
              onAddToCart={addItem}
              onRemoveFromCart={removeItem}
              onUpdateQuantity={updateQuantity}
              cartItems={items}
            />
          </div>
        </section>
        
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
