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

const categories = ['Appetizers', 'Main Dishes', 'Sides', 'Desserts', 'Beverages'];

export const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Main Dishes');
  const { items, addItem, updateQuantity, removeItem, customerId } = useCart();

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
        <h1 className="text-3xl font-bold mb-6 text-center">Our Menu</h1>
        
        <Tabs defaultValue="Main Dishes" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory}>
            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500">No items available in this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => {
                  const cartItem = getCartItem(item._id);
                  
                  return (
                    <Card key={item._id} className="overflow-hidden">
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <p className="font-bold text-lg">${formatPrice(item.price)}</p>
                      </CardContent>
                      <CardFooter>
                        {!cartItem ? (
                          <Button 
                            className="w-full bg-food-orange hover:bg-food-orange-dark text-white" 
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleUpdateQuantity(item._id, (cartItem.quantity || 1) - 1)}
                              className="h-8 w-8 border-food-orange text-food-orange"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-2 font-medium">{cartItem.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleUpdateQuantity(item._id, (cartItem.quantity || 1) + 1)}
                              className="h-8 w-8 border-food-orange text-food-orange"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
