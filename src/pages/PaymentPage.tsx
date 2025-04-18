import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/formatters';

interface CheckoutInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  subtotal: number;
  discount: number;
  total: number;
  items: any[];
}

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedInfo = localStorage.getItem('checkout-info');
    if (!storedInfo) {
      navigate('/checkout');
      return;
    }
    setCheckoutInfo(JSON.parse(storedInfo));
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setCardInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const isFormValid = () => {
    const { cardNumber, expiryDate, cvv } = cardInfo;
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiryDate.length === 5 &&
      cvv.length === 3
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !checkoutInfo) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and checkout info
    clearCart();
    localStorage.removeItem('checkout-info');
    
    // Navigate to success page
    navigate('/payment-success');
  };

  if (!checkoutInfo) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Payment Details</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(checkoutInfo.subtotal)}</span>
              </div>
              {checkoutInfo.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (50% OFF)</span>
                  <span>-{formatPrice(checkoutInfo.subtotal * checkoutInfo.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(checkoutInfo.total)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <Input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                placeholder="1234 5678 9012 3456"
                value={cardInfo.cardNumber}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="text"
                  required
                  placeholder="MM/YY"
                  value={cardInfo.expiryDate}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                  CVV
                </label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="text"
                  required
                  placeholder="123"
                  value={cardInfo.cvv}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
              disabled={!isFormValid() || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(checkoutInfo.total)}`}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}; 