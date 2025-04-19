import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Salad } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, totalItems, total } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Salad className="h-6 w-6 text-gray-700 hover:text-food-orange transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-food-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-cart-bounce">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Order Summary</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button 
                onClick={() => navigate('/menu')}
                className="bg-food-orange hover:bg-food-orange-dark text-white"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold">Total:</p>
                  <p className="font-semibold">{formatPrice(total)}</p>
                </div>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                    onClick={() => navigate('/cart')}
                  >
                    View Cart
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer; 