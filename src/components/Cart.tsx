
import { useState, useEffect } from 'react';
import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from '@/data/menuData';
import OrderSummary from './OrderSummary';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
}

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartProps) => {
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowCheckout(false);
    }
  }, [isOpen]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-food-orange" />
            <h2 className="text-lg font-medium">
              {showCheckout ? 'Checkout' : 'Your Cart'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {showCheckout ? (
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal} 
            onBackToCart={handleBackToCart}
            onOrderComplete={() => {
              onClearCart();
              onClose();
            }}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                  <p className="text-gray-500 mb-4">Add some delicious items to get started!</p>
                  <Button onClick={onClose} className="bg-food-orange hover:bg-food-orange-dark text-white">
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 pb-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <span className="text-sm">-</span>
                          </Button>
                          <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <span className="text-sm">+</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-lg font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onClearCart}
                  className="w-full text-gray-600 border-gray-300"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
