
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { Slider } from '@/components/ui/slider';

export const CartPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalItems,
    subtotal, // Use subtotal instead of totalPrice
    total
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
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
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-4 w-48">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="h-8 w-8 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex-1">
                          <Slider
                            value={[item.quantity]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => handleQuantityChange(item._id, value[0])}
                            className="[&_[role=slider]]:bg-food-orange [&_[role=slider]]:border-food-orange [&_[role=slider]]:focus:ring-food-orange [&_[role=track]]:bg-food-orange/20 [&_[role=range]]:bg-food-orange"
                          />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="h-8 w-8 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
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
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Quantity: {item.quantity}
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
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (Coupon Applied):</span>
                      <span>-{formatPrice(subtotal * discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                  disabled={items.length === 0}
                >
                  {`Proceed to Checkout (${formatPrice(total || subtotal)})`}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                  disabled={items.length === 0}
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
    <div className="container mx-auto px-4 py-8">
      <CartContent />
    </div>
  );
};
