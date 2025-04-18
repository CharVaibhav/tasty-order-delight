import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MenuPage } from './MenuPage';
import { HeroBanner } from '@/components/HeroBanner';

const Index = () => {
  return (
    <Layout>
      <HeroBanner />
      <div id="menu-section">
        <MenuPage />
      </div>
    </Layout>
  );
};

export default Index;
