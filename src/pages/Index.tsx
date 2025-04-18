import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategorySelector from '@/components/CategorySelector';
import FoodCard from '@/components/FoodCard';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import Cart from '@/components/Cart';
import { categories, menuItems, CartItem, MenuItem } from '@/data/menuData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);

  // Filter menu items when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItems={cartItems} toggleCart={toggleCart} />
      
      {/* Hero Section */}
      <div className="bg-food-orange text-white py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Delicious Food Delivered To Your Door</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Order your favorite meals with just a few clicks and enjoy a seamless food delivery experience.
          </p>
          <button 
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-food-orange font-medium py-3 px-6 rounded-full hover:bg-food-cream hover:text-food-orange-dark transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>

      {/* Popular Items Marquee */}
      <div className="py-8">
        <div className="container mx-auto px-4 mb-6">
          <h2 className="text-2xl font-bold text-food-gray-dark">Popular Items</h2>
        </div>
        <PopularItemsMarquee
          items={menuItems.filter(item => item.popular)}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          cartItems={cartItems}
        />
        <Separator className="my-12" />
      </div>
      
      {/* Main Menu Section */}
      <div id="menu" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-food-gray-dark mb-6">Our Menu</h2>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredItems.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              itemInCart={cartItems.find(cartItem => cartItem.id === item.id)}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-food-gray-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TastyDelight</h3>
              <p className="text-gray-300">
                Delicious food delivered to your doorstep. Fast, reliable, and always fresh.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <p className="text-gray-300">Monday - Friday: 10:00 AM - 10:00 PM</p>
              <p className="text-gray-300">Saturday - Sunday: 11:00 AM - 11:00 PM</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">123 Food Street, Tasty City</p>
              <p className="text-gray-300">Phone: (123) 456-7890</p>
              <p className="text-gray-300">Email: info@tastydelight.com</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} TastyDelight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
};

export default Index;
