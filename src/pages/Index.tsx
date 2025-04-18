import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
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
    <Layout>
      <div className="min-h-screen bg-gray-50">
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

        <div className="container mx-auto px-4 py-12">
          {/* Popular Items Marquee */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-food-gray-dark mb-6">Popular Items</h2>
            <PopularItemsMarquee
              items={menuItems.filter(item => item.popular)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              cartItems={cartItems}
            />
          </div>
          
          <Separator className="my-12" />
          
          {/* Main Menu Section */}
          <div id="menu">
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
        </div>

        {/* Cart Sidebar */}
        <Cart
          isOpen={isCartOpen}
          onClose={toggleCart}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />
      </div>
    </Layout>
  );
};

export default Index;
