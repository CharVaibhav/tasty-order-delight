import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalItems, 
    totalPrice 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const CartContent = () => {
    if (totalItems === 0) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to your cart!</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-food-orange hover:bg-food-orange-dark text-white"
          >
            Browse Menu
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item._id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <CartContent />
      </div>
    </Layout>
  );
}; 