
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Soup } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import Marquee from 'react-fast-marquee';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { CartDrawer } from '@/components/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const cartCount = totalItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <header className="bg-food-orange text-white shadow-md dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-2xl font-bold">
              The Digital Diner
            </Link>
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`hover:text-food-cream transition-colors ${
                    isActive('/') ? 'text-food-cream' : ''
                  }`}
                >
                  Menu
                </Link>
                <Link 
                  to="/about" 
                  className={`hover:text-food-cream transition-colors ${
                    isActive('/about') ? 'text-food-cream' : ''
                  }`}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`hover:text-food-cream transition-colors ${
                    isActive('/contact') ? 'text-food-cream' : ''
                  }`}
                >
                  Contact
                </Link>
                <CartDrawer />
                <ThemeToggle />
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-food-orange-dark py-2 dark:bg-gray-700">
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
          >
            <div className="flex items-center space-x-8">
              <span className="text-xl font-semibold">🎉 50% OFF on your first 5 orders! 🎉</span>
              <span className="text-xl">|</span>
              <span className="text-xl font-semibold">Limited time offer - Order now!</span>
              <span className="text-xl">|</span>
              <span className="text-xl font-semibold">Use code: FIRST50 at checkout</span>
              <span className="text-xl">|</span>
              <span className="text-xl font-semibold">🎉 50% OFF on your first 5 orders! 🎉</span>
            </div>
          </Marquee>
        </div>
      </header>

      <main className="flex-grow dark:text-white">
        {children}
      </main>

      <footer className="bg-food-orange text-white py-4 mt-8 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} The Digital Diner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
