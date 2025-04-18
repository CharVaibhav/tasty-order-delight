import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { CartItem } from '@/data/menuData';
import { useNavigate, Link } from 'react-router-dom';
import CouponInput from './CouponInput';

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
  cartItems?: CartItem[];
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onClearCart?: () => void;
  discount?: number;
  onApplyCoupon?: (discount: number) => void;
}

const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems: externalCartItems, 
  onRemoveItem, 
  onUpdateQuantity,
  onClearCart,
  discount = 0,
  onApplyCoupon
}) => {
  const { items, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  
  // Use external cart items if provided, otherwise use context items
  const displayItems = externalCartItems || items;
  
  // Use external handlers if provided, otherwise use context handlers
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(id, quantity);
    } else {
      updateQuantity(id, quantity);
    }
  };
  
  const handleRemoveItem = (id: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
    } else {
      removeItem(id);
    }
  };

  const handleCheckout = () => {
    if (onClose) {
      onClose();
    }
    navigate('/checkout');
  };

  const subtotal = displayItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full pr-4">
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Your cart is empty</p>
                <Button onClick={onClose} variant="outline" className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayItems.map((item) => (
                  <div key={item._id} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 mb-2">
                      {item.imageUrl && (
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pl-20">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-food-orange text-food-orange hover:bg-food-orange hover:text-white"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        
        {displayItems.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4 flex-shrink-0">
            {onApplyCoupon && (
              <>
                <div className="mb-4">
                  <CouponInput onApplyCoupon={onApplyCoupon} />
                </div>
                <Separator />
              </>
            )}
            
            <div className="flex items-center justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between font-medium text-green-600">
                <span>Discount (50% OFF)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="space-y-2 pb-4">
              <Link to="/checkout" className="w-full">
                <Button 
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (onClearCart) {
                    onClearCart();
                  }
                }}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
