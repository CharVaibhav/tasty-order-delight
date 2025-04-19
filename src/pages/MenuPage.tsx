
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { api, MenuItem } from '@/lib/api/api';
import { useCart } from '@/lib/context/CartContext';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import CategorySelector from '@/components/CategorySelector';
import SearchBar from '@/components/SearchBar';
import FoodCard from '@/components/FoodCard';
import { categories, menuItems as defaultMenuItems } from '@/data/menuData';
import PopularItemsMarquee from '@/components/PopularItemsMarquee';
import PriceRangeSlider from '@/components/PriceRangeSlider';

interface MenuPageProps {
  hideLayout?: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({ hideLayout = false }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, addItem, updateQuantity, removeItem, customerId } = useCart();
  const { toast } = useToast();

  // Calculate max price from menu items
  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...menuItems.map(item => item.price)));
  }, [menuItems]);

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

  const filteredMenuItems = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);
    
    // Apply price filter
    filtered = filtered.filter(item => item.price <= priceRange);
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [menuItems, selectedCategory, priceRange, searchQuery]);

  const popularItems = menuItems.filter(item => item.category === 'Main Dishes');

  const content = (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>
      
      <PopularItemsMarquee 
        items={popularItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={removeItem}
        onUpdateQuantity={updateQuantity}
        cartItems={items}
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Search</h2>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for dishes..."
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <CategorySelector
              categories={[{ id: 'all', name: 'All' }, ...categories]}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Price</h2>
            <PriceRangeSlider
              maxPrice={maxPrice}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          {filteredMenuItems.length === 0 ? (
            <p className="text-center mt-8 text-gray-500 dark:text-gray-400">
              No dishes found with the current filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredMenuItems.map((item) => (
                <FoodCard
                  key={item._id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  itemInCart={items.find(cartItem => cartItem._id === item._id)}
                  onRemoveFromCart={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>
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
        {content}
      </div>
    </Layout>
  );
};
