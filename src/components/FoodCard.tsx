
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { MenuItem, CartItem } from '@/data/menuData';
import { formatPrice } from '@/utils/formatters';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  itemInCart?: CartItem;
  onRemoveFromCart?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

const FoodCard = ({ 
  item, 
  onAddToCart, 
  itemInCart, 
  onRemoveFromCart,
  onUpdateQuantity
}: FoodCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = () => {
    console.log('Adding item to cart:', item.name);
    setIsAddingToCart(true);
    onAddToCart({ ...item, quantity: 1 });
    setIsAddingToCart(false);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleIncreaseQuantity = () => {
    if (itemInCart && onUpdateQuantity) {
      onUpdateQuantity(item._id, itemInCart.quantity + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecreaseQuantity = () => {
    if (itemInCart && onUpdateQuantity && itemInCart.quantity > 1) {
      onUpdateQuantity(item._id, itemInCart.quantity - 1);
    } else if (itemInCart && onRemoveFromCart) {
      onRemoveFromCart(item._id);
    }
  };

  return (
    <div className="food-card-shadow bg-white rounded-lg overflow-hidden flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {item.category === "Main Courses" && (
          <Badge className="absolute top-2 right-2 bg-food-orange text-white border-none">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-food-gray-dark">{item.name}</h3>
          <span className="font-bold text-food-orange">{formatPrice(item.price)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 flex-grow">{item.description}</p>
        <div className="flex mt-auto">
          {item.category === "Appetizers" && (
            <Badge variant="outline" className="mr-1 text-xs border-food-green text-food-green">
              Vegetarian
            </Badge>
          )}
          {item.category === "Main Courses" && (
            <Badge variant="outline" className="mr-1 text-xs border-food-red text-food-red">
              Spicy
            </Badge>
          )}
        </div>
        <div className="mt-4">
          {!itemInCart ? (
            <Button 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-food-orange hover:bg-food-orange-dark text-white"
            >
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleDecreaseQuantity}
                variant="outline" 
                size="icon" 
                className="h-8 w-8 border-food-orange text-food-orange"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2 font-medium">{itemInCart.quantity}</span>
              <Button 
                onClick={handleIncreaseQuantity}
                variant="outline" 
                size="icon" 
                className="h-8 w-8 border-food-orange text-food-orange"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
