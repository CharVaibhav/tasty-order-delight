import React from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Header: React.FC = () => {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
            <span className="text-orange-500">🔥 Special Offers!</span>
            <span>Order above ₹999 for free delivery</span>
            <span className="text-green-500">👨‍🍳 Fresh Indian cuisine made daily</span>
            <span>New items added to our menu!</span>
          </div>
        </Marquee>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600">
            Tasty Order Delight
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-orange-600">Menu</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600">Contact</Link>
          </nav>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 