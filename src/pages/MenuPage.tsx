import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { api, MenuItem } from '@/lib/api/api';
import { useCart } from '@/lib/context/CartContext';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import CategorySelector from '@/components/CategorySelector';
import FoodCard from '@/components/FoodCard';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import { categories, menuItems as defaultMenuItems } from '@/data/menuData';

interface MenuPageProps {
  hideLayout?: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({ hideLayout = false }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { items, addItem, updateQuantity, removeItem, customerId } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const fetchedItems = await api.getMenuItems();
        setMenuItems(fetchedItems.length > 0 ? fetchedItems : defaultMenuItems);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch menu items, using default data:', err);
        setMenuItems(defaultMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToCart = async (item: MenuItem) => {
    try {
      addItem(item);
      
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

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => {
        const categoryMap: Record<string, string> = {
          'appetizers': 'Appetizers',
          'main-dishes': 'Main Courses',
          'sides': 'Sides',
          'desserts': 'Desserts',
          'beverages': 'Drinks'
        };
        return item.category === categoryMap[selectedCategory];
      });

  const content = (
    <div className="space-y-8">
      <PopularItemsMarquee 
        items={menuItems.filter(item => item.category === "Main Courses")}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={removeItem}
        onUpdateQuantity={handleUpdateQuantity}
        cartItems={items}
      />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Categories</h2>
        <CategorySelector 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No dishes found in this category.</p>
            <Button
              variant="link"
              onClick={() => setSelectedCategory('all')}
              className="text-food-orange hover:text-food-orange-dark mt-2"
            >
              View all dishes
            </Button>
          </div>
        ) : (
          filteredItems.map(item => (
            <FoodCard
              key={item._id}
              item={item}
              onAddToCart={handleAddToCart}
              itemInCart={getCartItem(item._id)}
              onRemoveFromCart={removeItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))
        )}
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-food-orange"></div>
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
