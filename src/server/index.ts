import express from 'express';
import cors from 'cors';
import { connectMongoDB, testPGConnection } from '../lib/db/config';
import { createCustomerTable } from '../lib/db/models/Customer';
import { createOrderTables } from '../lib/db/models/Order';
import { MenuService } from '../lib/services/menuService';
import { CartService } from '../lib/services/cartService';
import { OrderService } from '../lib/services/orderService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize databases and start server
const initializeServer = async () => {
  try {
    // Connect to databases
    await connectMongoDB();
    await testPGConnection();
    
    // Create necessary tables
    await createCustomerTable();
    await createOrderTables();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

initializeServer();

// API Routes
// Menu routes
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuService.getAllMenuItems();
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to retrieve menu items' });
  }
});

app.get('/api/menu/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await MenuService.getMenuItemsByCategory(category);
    res.json(menuItems);
  } catch (error) {
    console.error(`Error fetching menu items for category ${req.params.category}:`, error);
    res.status(500).json({ error: 'Failed to retrieve menu items by category' });
  }
});

app.get('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuService.getMenuItemById(id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error(`Error fetching menu item with id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Cart routes
app.post('/api/cart/add', async (req, res) => {
  try {
    const { customerId, productData } = req.body;
    
    if (!customerId || !productData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const cartOperation = await CartService.addToCart(customerId, productData);
    res.status(201).json(cartOperation);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.post('/api/cart/remove', async (req, res) => {
  try {
    const { customerId, productData } = req.body;
    
    if (!customerId || !productData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const cartOperation = await CartService.removeFromCart(customerId, productData);
    res.status(201).json(cartOperation);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

app.get('/api/cart/history/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const cartHistory = await CartService.getCartHistory(customerId);
    res.json(cartHistory);
  } catch (error) {
    console.error('Error fetching cart history:', error);
    res.status(500).json({ error: 'Failed to fetch cart history' });
  }
});

// Order routes
app.post('/api/orders', async (req, res) => {
  try {
    const { customerData, cartItems } = req.body;
    
    // Validate request data
    if (!customerData || !cartItems) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both customerData and cartItems are required' 
      });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid cart items',
        details: 'Cart items must be a non-empty array' 
      });
    }

    if (!customerData.customerId) {
      return res.status(400).json({ 
        error: 'Invalid customer data',
        details: 'Customer ID is required' 
      });
    }
    
    const order = await OrderService.createOrder(customerData, cartItems);
    
    if (!order) {
      throw new Error('Failed to create order in database');
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await OrderService.getOrdersByCustomerId(customerId);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
}); 