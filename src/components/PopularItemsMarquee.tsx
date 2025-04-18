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
  // Get one item from each category
  const categories = ['appetizer', 'main', 'dessert', 'beverage', 'special'];
  const popularItemsByCategory = categories.map(category => {
    const categoryItems = items.filter(item => item.category === category);
    return categoryItems.length > 0 ? categoryItems[0] : null;
  }).filter(Boolean) as MenuItem[];

  return (
    <div className="overflow-hidden py-6 bg-food-orange/5">
      <div className="flex animate-marquee">
        {[...popularItemsByCategory, ...popularItemsByCategory].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-shrink-0 w-64 mx-4">
            <FoodCard
              item={item}
              onAddToCart={onAddToCart}
              itemInCart={cartItems.find(cartItem => cartItem.id === item.id)}
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