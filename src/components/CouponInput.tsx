import React, { useState } from 'react';
import { Ticket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CouponInputProps {
  onApplyCoupon: (discount: number) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST50') {
      if (!isApplied) {
        onApplyCoupon(0.5); // 50% discount
        setIsApplied(true);
        toast({
          title: "Coupon Applied!",
          description: "50% discount has been applied to your order.",
          variant: "default",
        });
      } else {
        toast({
          title: "Coupon Already Applied",
          description: "This coupon has already been applied to your order.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
    }
    setCouponCode('');
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-food-orange focus:ring-food-orange"
        />
      </div>
      <Button 
        onClick={handleApplyCoupon}
        variant="outline"
        className="whitespace-nowrap hover:bg-food-orange hover:text-white"
      >
        Apply Coupon
      </Button>
    </div>
  );
};

export default CouponInput; 