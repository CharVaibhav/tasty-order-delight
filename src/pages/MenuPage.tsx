import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api, MenuItem } from '@/lib/api/api';
import { useCart } from '@/lib/context/CartContext';
import { Layout } from '@/components/layout/Layout';
import { toast } from '@/components/ui/use-toast';
import { Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import CategorySelector from '@/components/CategorySelector';
import FoodCard from '@/components/FoodCard';
import { categories, menuItems } from '@/data/menuData';
import { useToast } from '@/components/ui/use-toast';

interface MenuPageProps {
  hideLayout?: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({ hideLayout = false }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Main Dishes');
  const { items, addItem, updateQuantity, removeItem, customerId } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await api.getMenuItems();
        setMenuItems(items);
        setError(null);
      } catch (err) {
        setError('Failed to load menu items. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = async (item: MenuItem) => {
    try {
      console.log("Adding item to cart:", item);
      
      // Add to local cart state
      addItem({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
      });

      // Record in MongoDB
      await api.addToCart(customerId, {
        productId: item._id,
        quantity: 1,
        productDetails: {
          name: item.name,
          price: item.price,
          category: item.category,
        },
      });

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
      
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isItemInCart = (itemId: string) => {
    return items.findIndex(cartItem => cartItem._id === itemId) !== -1;
  };

  const getCartItem = (itemId: string) => {
    return items.find(cartItem => cartItem._id === itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, quantity);
    }
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const content = (
    <div className="space-y-8">
      <CategorySelector 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <FoodCard
            key={item._id}
            item={item}
            onAddToCart={handleAddToCart}
            itemInCart={getCartItem(item._id)}
            onRemoveFromCart={removeItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </div>
    </div>
  );

  if (hideLayout) {
    return content;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p>{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-food-gray-dark dark:text-gray-100 mb-2">Our Menu</h1>
        <p className="text-food-gray dark:text-gray-300 mb-8">Discover our delicious dishes</p>
        {content}
      </div>
    </Layout>
  );
};
