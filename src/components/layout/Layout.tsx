
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-food-orange text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            The Digital Diner
          </Link>
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
            <Link to="/cart" className="relative hover:text-food-cream transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-food-orange rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-food-orange text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} The Digital Diner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}; 
