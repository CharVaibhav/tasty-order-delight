import React from 'react';
import { Layout } from '@/components/layout/Layout';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/lib/context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleOrderComplete = () => {
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <OrderSummary
          cartItems={items}
          subtotal={subtotal}
          onBackToCart={handleBackToCart}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    </Layout>
  );
};

export default CheckoutPage; 