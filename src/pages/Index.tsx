import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import CategorySelector from '@/components/CategorySelector';
import FoodCard from '@/components/FoodCard';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import Cart from '@/components/Cart';
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
      const categoryMap: Record<string, string> = {
        'appetizers': 'Appetizers',
        'main-dishes': 'Main Courses',
        'sides': 'Sides',
        'desserts': 'Desserts',
        'beverages': 'Drinks'
      };
      
      const categoryToFilter = categoryMap[selectedCategory];
      setFilteredItems(menuItems.filter(item => item.category === categoryToFilter));
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-food-gray-dark mb-2">Our Menu</h1>
          <p className="text-food-gray">Discover our delicious dishes</p>
        </div>

        <PopularItemsMarquee 
          items={menuItems.filter(item => item.category === "Main Courses")}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={removeItem}
          onUpdateQuantity={updateQuantity}
          cartItems={cartItems}
        />

        <Separator className="my-8" />

        <CategorySelector 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredItems.map(item => (
            <FoodCard
              key={item._id}
              item={item}
              onAddToCart={handleAddToCart}
              itemInCart={cartItems.find(cartItem => cartItem._id === item._id)}
              onRemoveFromCart={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
      </div>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />
    </Layout>
  );
};

export default Index;
