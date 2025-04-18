import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { formatPrice } from '@/utils/formatters';

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/checkout');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      toast({
        title: "Processing payment...",
        description: "Please wait while we process your payment.",
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      toast({
        title: "Payment successful!",
        description: "Your order has been confirmed.",
      });

      setShowConfirmation(true);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Please check your payment details and try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/');
  };

  const isFormValid = paymentMethod === 'cod' || (
    formData.cardNumber.trim() !== '' &&
    formData.cardHolder.trim() !== '' &&
    formData.expiryDate.trim() !== '' &&
    formData.cvv.trim() !== ''
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit}>
              <RadioGroup
                defaultValue="card"
                className="mb-6"
                onValueChange={(value) => setPaymentMethod(value as 'card' | 'cod')}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      placeholder="John Doe"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
                  disabled={!isFormValid || isProcessing}
                >
                  {isProcessing ? 'Processing...' : paymentMethod === 'card' ? `Pay ${formatPrice(orderDetails.total)}` : 'Place Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showConfirmation && (
          <OrderConfirmation
            isOpen={showConfirmation}
            onClose={handleConfirmationClose}
            orderNumber={orderDetails.orderId}
            items={orderDetails.items}
            subtotal={orderDetails.subtotal}
            tax={orderDetails.tax}
            total={orderDetails.total}
            customerName={orderDetails.customerName}
            customerPhone={orderDetails.customerPhone}
            customerAddress={orderDetails.customerAddress}
            deliveryFee={orderDetails.deliveryFee}
          />
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage; 