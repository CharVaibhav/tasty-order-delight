import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import { menuItems } from '@/data/menuData';
import { useCart } from '@/lib/context/CartContext';

const Index = () => {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const popularItems = menuItems.filter(item => item.category === "Main Courses");

  return (
    <Layout>
      <main>
        <HeroBanner />
        
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-food-gray-dark dark:text-gray-100 mb-6">
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

        <section id="menu-section" className="py-12">
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
