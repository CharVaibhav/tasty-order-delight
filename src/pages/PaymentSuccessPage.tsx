import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  // Trigger confetti effect when the component mounts
  useEffect(() => {
    // Create a simple confetti effect
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const runConfetti = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF7E33', '#FFB74D', '#FFF176']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF7E33', '#FFB74D', '#FFF176']
      });

      if (Date.now() < end) {
        requestAnimationFrame(runConfetti);
      }
    };

    try {
      runConfetti();
    } catch (e) {
      console.error('Confetti error:', e);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-green-100 animate-pulse"></div>
          </div>
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 relative z-10" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order. We'll start preparing your delicious meal right away!
        </p>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-8">
          <p className="text-amber-800 text-sm">
            Your order confirmation has been sent to your email address.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
          >
            Return to Menu
          </Button>
          
          <Button
            onClick={() => navigate('/menu')}
            variant="outline"
            className="w-full"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}; 