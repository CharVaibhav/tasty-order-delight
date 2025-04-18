
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/data/menuData';
import { format } from 'date-fns';

interface OrderTicketProps {
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

export const OrderTicket: React.FC<OrderTicketProps> = ({
  orderNumber,
  items,
  subtotal,
  tax,
  deliveryFee,
  total,
  customerName,
  customerPhone,
  customerAddress,
  notes,
}) => {
  const currentDate = new Date();
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white p-4 font-mono text-sm">
      <CardContent className="space-y-4">
        <div className="text-center border-b pb-2">
          <h2 className="text-xl font-bold">The Digital Diner</h2>
          <p className="text-gray-600">Order Ticket</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Order #:</span>
            <span className="font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(currentDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{format(currentDate, 'hh:mm a')}</span>
          </div>
        </div>
        
        <div className="border-t border-b py-2">
          <div className="font-bold mb-1">Customer Details:</div>
          <div>{customerName}</div>
          <div>{customerPhone}</div>
          <div className="text-sm">{customerAddress}</div>
        </div>
        
        <div>
          <div className="font-bold mb-1">Order Items:</div>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        {notes && (
          <div className="border-t pt-2">
            <div className="font-bold mb-1">Order Notes:</div>
            <div className="text-sm">{notes}</div>
          </div>
        )}
        
        <div className="text-center border-t pt-2 text-xs text-gray-500">
          <p>Thank you for your order!</p>
          <p>Your delicious food is on the way.</p>
        </div>
      </CardContent>
    </Card>
  );
};
