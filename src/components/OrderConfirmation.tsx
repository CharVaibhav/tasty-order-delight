import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OrderTicket } from './OrderTicket';
import { CartItem } from '@/data/menuData';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  isOpen,
  onClose,
  ...orderDetails
}) => {
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show ticket after a short delay for animation
      const timer = setTimeout(() => setShowTicket(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTicket(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showTicket ? 1 : 0, y: showTicket ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <OrderTicket {...orderDetails} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showTicket ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-4 text-center"
              >
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  Order Confirmed!
                </h3>
                <p className="text-gray-600">
                  Your order has been successfully placed. We'll start preparing your food right away.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}; 