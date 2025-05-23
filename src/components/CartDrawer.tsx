
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Soup, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CouponInput from './CouponInput';

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, subtotal, totalItems, discount, setDiscount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [previousItemCount, setPreviousItemCount] = useState(totalItems);

  const total = subtotal * (1 - discount);

  // Debug logs to help troubleshoot
  console.log('Current total items:', totalItems);
  console.log('Previous item count:', previousItemCount);
  console.log('Is drawer open:', isOpen);

  // Automatically open drawer when items are added to cart
  useEffect(() => {
    // Only open if total item count has increased
    if (totalItems > previousItemCount) {
      console.log('Opening cart drawer - items increased');
      setIsOpen(true);
    }
    setPreviousItemCount(totalItems);
  }, [totalItems, previousItemCount]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Soup className="h-6 w-6 transition-colors hover:text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          {items.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </SheetHeader>
        <Separator className="my-4" />
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] py-8">
              <Soup className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/menu');
                }}
                variant="outline"
                className="font-medium"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item._id} className="flex flex-col p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-card-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-medium text-card-foreground">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4 flex-shrink-0">
            <div className="mb-4">
              <CouponInput onApplyCoupon={setDiscount} />
            </div>
            <Separator />
            
            <div className="flex items-center justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between font-medium text-green-600">
                <span>Discount (Coupon Applied)</span>
                <span>-{formatPrice(subtotal * discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="space-y-2 pb-4">
              <Button 
                className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/checkout');
                }}
              >
                Checkout
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  navigate('/cart');
                  setIsOpen(false);
                }}
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
