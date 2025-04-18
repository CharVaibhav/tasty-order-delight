
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import CategorySelector from '@/components/CategorySelector';
import FoodCard from '@/components/FoodCard';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import { Cart } from '@/components/Cart';  // Change to named import
import { categories, menuItems, CartItem, MenuItem } from '@/data/menuData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/context/CartContext';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();

  // Filter menu items when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    setIsCartOpen(true);
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
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
              onRemoveFromCart={removeItem}
              onUpdateQuantity={updateQuantity}
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
                  onRemoveFromCart={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
        />
      </div>
    </Layout>
  );
};

export default Index;
