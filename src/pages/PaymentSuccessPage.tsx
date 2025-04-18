import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your order. We'll start preparing your delicious meal right away!
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
            >
              Return to Menu
            </Button>
            
            <Button
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full"
            >
              View Orders
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 