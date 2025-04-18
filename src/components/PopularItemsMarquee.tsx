
import React from 'react';
import { motion } from 'framer-motion';
import FoodCard from './FoodCard';
import { MenuItem, CartItem } from '@/data/menuData';

interface PopularItemsMarqueeProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  cartItems: CartItem[];
}

const PopularItemsMarquee: React.FC<PopularItemsMarqueeProps> = ({
  items,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  cartItems,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden py-6 bg-food-orange/5 relative">
      <div className="flex space-x-6 animate-scroll">
        {[...items, ...items].map((item, index) => (
          <div 
            key={`${item._id}-${index}`} 
            className="flex-shrink-0 w-72"
          >
            <FoodCard
              item={item}
              onAddToCart={onAddToCart}
              itemInCart={cartItems.find(cartItem => cartItem._id === item._id)}
              onRemoveFromCart={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItemsMarquee;
