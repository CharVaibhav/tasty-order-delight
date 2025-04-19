import React from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/formatters';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Announcement Marquee */}
      <div className="bg-gray-100 py-2">
        <Marquee
          gradient={false}
          speed={40}
          loop={0}
          pauseOnHover={true}
        >
          <div className="flex items-center space-x-8 px-4">
            <span className="text-food-orange">🔥 Special Offers!</span>
            <span>Order above {formatPrice(999)} for free delivery</span>
            <span className="text-green-500">👨‍🍳 Fresh Indian cuisine made daily</span>
            <span>New items added to our menu!</span>
          </div>
        </Marquee>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-food-orange">
            Tasty Order Delight
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-food-orange transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-food-orange transition-colors">
              Menu
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-food-orange transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-food-orange transition-colors">
              Contact
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <CartDrawer />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:bg-food-orange/10 hover:text-food-orange rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="block px-4 py-2 text-gray-700 hover:bg-food-orange/10 hover:text-food-orange rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className="block px-4 py-2 text-gray-700 hover:bg-food-orange/10 hover:text-food-orange rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-4 py-2 text-gray-700 hover:bg-food-orange/10 hover:text-food-orange rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
