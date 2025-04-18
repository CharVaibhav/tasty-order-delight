import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from '@/data/menuData';
import { toast } from '@/components/ui/use-toast';
import { OrderConfirmation } from './OrderConfirmation';
import { api } from '@/lib/api/api';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

const OrderSummary = ({
  cartItems,
  subtotal,
  onBackToCart,
  onOrderComplete,
}: OrderSummaryProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !address) {
      toast({
        title: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order through API
      const order = await api.createOrder(
        {
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          email: '', // Optional
          phone,
          address,
        },
        cartItems.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      setOrderNumber(order.order_id);
      setShowConfirmation(true);
      
      // After 5 seconds, close the cart
      setTimeout(() => {
        onOrderComplete();
      }, 5000);
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Button 
            type="button"
            variant="ghost" 
            className="flex items-center text-gray-600 mb-4 -ml-2 hover:bg-transparent hover:text-food-orange"
            onClick={onBackToCart}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to cart
          </Button>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Delivery Information</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your delivery address"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for your order"
                  rows={2}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span className="text-gray-600">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="space-y-1 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-food-orange">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4">
          <Button
            type="submit"
            className="w-full bg-food-orange hover:bg-food-orange-dark text-white h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </form>

      <OrderConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderNumber={orderNumber}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        deliveryFee={deliveryFee}
        total={total}
        customerName={name}
        customerPhone={phone}
        customerAddress={address}
        notes={notes}
      />
    </>
  );
};

export default OrderSummary;
