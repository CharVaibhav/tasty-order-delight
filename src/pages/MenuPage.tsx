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

  // Filter items based on category, price range, and search query
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const categoryMatch = selectedCategory === 'all' 
        ? true 
        : item.category === categories.find(cat => cat.id === selectedCategory)?.name;
      const priceMatch = item.price <= priceRange;
      const searchMatch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    }).sort((a, b) => a.price - b.price);
  }, [menuItems, selectedCategory, priceRange, searchQuery]);

  const content = (
    <div className="space-y-12">
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-food-gray-dark dark:text-gray-100 mb-2">Our Menu</h1>
          <p className="text-food-gray dark:text-gray-300">Discover our delicious dishes</p>
        </div>
        
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by dish name or description..."
        />
        
        <CategorySelector 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          maxPrice={maxPrice}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'No dishes found matching your search criteria.' 
                : 'No dishes found in this category within the selected price range.'}
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange(maxPrice);
                setSearchQuery('');
              }}
              className="text-food-orange hover:text-food-orange-dark mt-2"
            >
              Reset filters
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
        {content}
      </div>
    </Layout>
  );
};
