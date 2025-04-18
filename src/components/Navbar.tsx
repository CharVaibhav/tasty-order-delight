import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bowl, Menu, X } from 'lucide-react'; // Replace ShoppingCart with Bowl
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartItem } from '@/data/menuData';

interface NavbarProps {
  cartItems: CartItem[];
  toggleCart: () => void;
}

const Navbar = ({ cartItems, toggleCart }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-food-orange">
              Tasty<span className="text-food-gray-dark">Delight</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-food-gray-dark hover:text-food-orange transition-colors ${
                isActive('/') ? 'text-food-orange font-medium' : ''
              }`}
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className={`text-food-gray-dark hover:text-food-orange transition-colors ${
                isActive('/about') ? 'text-food-orange font-medium' : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-food-gray-dark hover:text-food-orange transition-colors ${
                isActive('/contact') ? 'text-food-orange font-medium' : ''
              }`}
            >
              Contact
            </Link>
            <Button 
              onClick={toggleCart}
              variant="outline" 
              className="relative border-food-orange text-food-orange hover:bg-food-orange hover:text-white transition-all"
            >
              <Bowl className="h-5 w-5 mr-2" />
              <span>Cart</span>
              {totalItems > 0 && (
                <Badge 
                  className={`absolute -top-2 -right-2 bg-food-orange text-white 
                    ${cartItems.length > 0 ? 'animate-cart-bounce' : ''}`}
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Mobile Menu Button and Cart */}

        <div className="md:hidden flex items-center">
          <Button 
            onClick={toggleCart}
            variant="outline" 
            className="relative mr-2 border-food-orange text-food-orange"
            size="sm"
          >
            <Bowl className="h-5 w-5" /> {/* Updated icon */}
            {totalItems > 0 && (
              <Badge 
                className={`absolute -top-2 -right-2 bg-food-orange text-white 
                  ${cartItems.length > 0 ? 'animate-cart-bounce' : ''}`}
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          
          {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-food-gray-dark"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`text-food-gray-dark hover:text-food-orange px-3 py-2 ${
                  isActive('/') ? 'text-food-orange font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/about" 
                className={`text-food-gray-dark hover:text-food-orange px-3 py-2 ${
                  isActive('/about') ? 'text-food-orange font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`text-food-gray-dark hover:text-food-orange px-3 py-2 ${
                  isActive('/contact') ? 'text-food-orange font-medium' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
