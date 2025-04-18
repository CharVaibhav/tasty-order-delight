import { Order } from '../db/models/Order';
import { CartService } from './cartService';
import { v4 as uuidv4 } from 'uuid';

export const OrderService = {
  async createOrder(customerData: {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  }, cartItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>) {
    try {
      // Create or update customer
      const customer = await CartService.createOrUpdateCustomer(customerData);
      
      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
      
      // Generate order ID
      const orderId = uuidv4();
      
      // Create order
      const order = await Order.create({
        orderId,
        customerId: customer.customer_id,
        totalAmount,
        items: cartItems
      });
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrdersByCustomerId(customerId: string) {
    try {
      const orders = await Order.getByCustomerId(customerId);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getOrderById(orderId: string) {
    try {
      const order = await Order.getByOrderId(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await Order.updateStatus(orderId, status);
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 