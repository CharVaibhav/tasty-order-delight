// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to handle API errors gracefully
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  // Return null instead of throwing an error to prevent app crashes
  return null;
};

// Types
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface CustomerData {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

// API functions
export const api = {
  // Menu endpoints
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      if (!response.ok) {
        console.warn('Failed to fetch menu items, using default data');
        return [];
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/category/${category}`);
      if (!response.ok) {
        console.warn(`Failed to fetch menu items for category: ${category}, using default data`);
        return [];
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/${id}`);
      if (!response.ok) {
        console.warn(`Failed to fetch menu item with id: ${id}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  // Cart endpoints
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
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          productData,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to add item to cart');
        return { success: false };
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
      return { success: false };
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
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          productData,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to remove item from cart');
        return { success: false };
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
      return { success: false };
    }
  },

  async getCartHistory(customerId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/history/${customerId}`);
      if (!response.ok) {
        console.warn('Failed to fetch cart history');
        return [];
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  // Order endpoints
  async createOrder(customerData: CustomerData, cartItems: OrderItem[]): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData,
          cartItems,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to create order');
        return null;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`);
      if (!response.ok) {
        console.warn('Failed to fetch orders');
        return [];
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        console.warn(`Failed to fetch order with id: ${orderId}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
}; 