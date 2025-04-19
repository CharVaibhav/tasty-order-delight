import React from 'react';
import { CartItem } from '@/data/menuData';
import OrderSummary from './OrderSummary';

interface OrderFormProps {
  cartItems: CartItem[];
  subtotal: number;
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  cartItems,
  subtotal,
  onBackToCart,
  onOrderComplete,
}) => {
  return (
    <OrderSummary
      cartItems={cartItems}
      subtotal={subtotal}
      onBackToCart={onBackToCart}
      onOrderComplete={onOrderComplete}
    />
  );
};

export default OrderForm; 