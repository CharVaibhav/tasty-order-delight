import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Soup, Search } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import Marquee from 'react-fast-marquee';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // You can implement the search logic here or pass it to a parent component
  };

  const cartCount = totalItems;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <header className="bg-food-orange text-white shadow-md dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-2xl font-bold">
              The Digital Diner
            </Link>
            <div className="flex items-center space-x-6">
              <div 
                className={cn(
                  "relative transition-all duration-300 ease-in-out",
                  isSearchExpanded ? "w-64" : "w-8"
                )}
                onMouseEnter={() => setIsSearchExpanded(true)}
                onMouseLeave={() => {
                  if (!searchTerm) {
                    setIsSearchExpanded(false);
                  }
                }}
              >
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={isSearchExpanded ? "Search dishes..." : ""}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={cn(
                    "pl-8 pr-4 py-1 w-full bg-white/10 border-transparent text-white placeholder:text-white/70",
                    "focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-white/20",
                    "transition-all duration-300 ease-in-out dark:bg-gray-700 dark:focus:bg-gray-600",
                    !isSearchExpanded && "cursor-pointer"
                  )}
                />
              </div>
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
                  <Soup className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-food-orange rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium dark:bg-gray-200">
                      {cartCount}
                    </span>
                  )}
                </Link>
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
