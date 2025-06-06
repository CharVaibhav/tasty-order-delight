import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from '@/data/menuData';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api/api';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { customerId, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = 2.99;
  const total = subtotal + tax + deliveryFee;

  const isFormValid = name.trim() !== '' && phone.trim() !== '' && address.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order first
      const order = await api.createOrder(
        {
          customerId,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          email: '', // Optional
          phone,
          address,
        },
        cartItems.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      if (!order || !order.order_id) {
        throw new Error('Invalid order response from server');
      }

      // Navigate to payment with order details
      navigate('/payment', {
        state: {
          orderDetails: {
            orderId: order.order_id,
            items: cartItems,
            subtotal,
            tax,
            deliveryFee,
            total,
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            notes,
            customerId
          }
        }
      });

      // Clear cart after successful order creation
      clearCart();
      onOrderComplete();

    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Failed to create order",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
              placeholder="(555) 123-4567"
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
              placeholder="123 Main St, Apt 4B, City, State 12345"
              required
              rows={2}
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
              placeholder="Special instructions, allergies, etc."
              rows={2}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between py-2">
                <span className="text-gray-600">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="space-y-1 pt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span className="text-food-orange">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t p-4 space-y-3">
        <Button
          type="submit"
          className="w-full bg-food-orange hover:bg-food-orange-dark text-white h-12"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : `Continue to Payment`}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBackToCart}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
      </div>
    </form>
  );
};

export default OrderSummary;
