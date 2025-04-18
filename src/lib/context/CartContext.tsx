import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/data/menuData';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  setDiscount: (value: number) => void;
  total: number;
  customerId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem('cart-items');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [discount, setDiscount] = useState<number>(() => {
    const savedDiscount = localStorage.getItem('cart-discount');
    return savedDiscount ? parseFloat(savedDiscount) : 0;
  });

  const [customerId] = useState(() => {
    const saved = localStorage.getItem('customer-id');
    return saved || Math.random().toString(36).substring(7);
  });

  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('cart-discount', discount.toString());
  }, [discount]);

  useEffect(() => {
    localStorage.setItem('customer-id', customerId);
  }, [customerId]);

  const addItem = (item: MenuItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i._id === item._id);
      if (existingItem) {
        return currentItems.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal * (1 - discount);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      discount,
      setDiscount,
      total,
      customerId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 