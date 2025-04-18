import { CartOperation } from '../db/models/CartOperation';
import { Customer } from '../db/models/Customer';

export const CartService = {
  async addToCart(customerId: string, productData: {
    productId: string;
    quantity: number;
    productDetails: {
      name: string;
      price: number;
      category: string;
    };
  }) {
    try {
      // Record the cart operation in MongoDB
      const cartOperation = new CartOperation({
        customerId,
        operationType: 'ADD',
        productId: productData.productId,
        quantity: productData.quantity,
        productDetails: productData.productDetails,
      });

      await cartOperation.save();
      return cartOperation;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async removeFromCart(customerId: string, productData: {
    productId: string;
    quantity: number;
    productDetails: {
      name: string;
      price: number;
      category: string;
    };
  }) {
    try {
      // Record the cart operation in MongoDB
      const cartOperation = new CartOperation({
        customerId,
        operationType: 'REMOVE',
        productId: productData.productId,
        quantity: productData.quantity,
        productDetails: productData.productDetails,
      });

      await cartOperation.save();
      return cartOperation;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async getCartHistory(customerId: string) {
    try {
      const cartHistory = await CartOperation.find({ customerId })
        .sort({ timestamp: -1 });
      return cartHistory;
    } catch (error) {
      console.error('Error fetching cart history:', error);
      throw error;
    }
  },

  async createOrUpdateCustomer(customerData: {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  }) {
    try {
      // Check if customer exists
      const existingCustomer = await Customer.getById(customerData.customerId);
      
      if (existingCustomer) {
        // Update existing customer
        return await Customer.update(customerData.customerId, {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        });
      } else {
        // Create new customer
        return await Customer.create(customerData);
      }
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      throw error;
    }
  }
}; 