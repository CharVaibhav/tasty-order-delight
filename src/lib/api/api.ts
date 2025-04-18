// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }
    return response.json();
  },

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/menu/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu items for category: ${category}`);
    }
    return response.json();
  },

  async getMenuItemById(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu item with id: ${id}`);
    }
    return response.json();
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
      throw new Error('Failed to add item to cart');
    }

    return response.json();
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
      throw new Error('Failed to remove item from cart');
    }

    return response.json();
  },

  async getCartHistory(customerId: string) {
    const response = await fetch(`${API_BASE_URL}/cart/history/${customerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart history');
    }
    return response.json();
  },

  // Order endpoints
  async createOrder(customerData: CustomerData, cartItems: OrderItem[]): Promise<Order> {
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
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch order with id: ${orderId}`);
    }
    return response.json();
  },
}; 