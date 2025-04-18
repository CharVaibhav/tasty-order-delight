import express, { Request, Response, RequestHandler, NextFunction } from 'express';
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
const getAllMenuItems: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const menuItems = await MenuService.getAllMenuItems();
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

const getMenuItemsByCategory: RequestHandler<{ category: string }> = async (req, res, next): Promise<void> => {
  try {
    const { category } = req.params;
    const menuItems = await MenuService.getMenuItemsByCategory(category);
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

const getMenuItemById: RequestHandler<{ id: string }> = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;
    const menuItem = await MenuService.getMenuItemById(id);
    
    if (!menuItem) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }
    
    res.json(menuItem);
  } catch (error) {
    next(error);
  }
};

// Cart routes
const addToCart: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { customerId, productData } = req.body;
    
    if (!customerId || !productData) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const cartOperation = await CartService.addToCart(customerId, productData);
    res.status(201).json(cartOperation);
  } catch (error) {
    next(error);
  }
};

const removeFromCart: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { customerId, productData } = req.body;
    
    if (!customerId || !productData) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const cartOperation = await CartService.removeFromCart(customerId, productData);
    res.status(201).json(cartOperation);
  } catch (error) {
    next(error);
  }
};

const getCartHistory: RequestHandler<{ customerId: string }> = async (req, res, next): Promise<void> => {
  try {
    const { customerId } = req.params;
    const cartHistory = await CartService.getCartHistory(customerId);
    res.json(cartHistory);
  } catch (error) {
    next(error);
  }
};

// Order routes
const createOrder: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { customerData, cartItems } = req.body;
    
    // Validate request data
    if (!customerData || !cartItems) {
      res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both customerData and cartItems are required' 
      });
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      res.status(400).json({ 
        error: 'Invalid cart items',
        details: 'Cart items must be a non-empty array' 
      });
      return;
    }

    if (!customerData.customerId) {
      res.status(400).json({ 
        error: 'Invalid customer data',
        details: 'Customer ID is required' 
      });
      return;
    }
    
    const order = await OrderService.createOrder(customerData, cartItems);
    
    if (!order) {
      throw new Error('Failed to create order in database');
    }
    
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrdersByCustomerId: RequestHandler<{ customerId: string }> = async (req, res, next): Promise<void> => {
  try {
    const { customerId } = req.params;
    const orders = await OrderService.getOrdersByCustomerId(customerId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById: RequestHandler<{ orderId: string }> = async (req, res, next): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderById(orderId);
    
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Health check endpoint
const healthCheck: RequestHandler = (_req, res): void => {
  res.status(200).json({ status: 'ok' });
};

// Route handlers
app.get('/api/menu', getAllMenuItems);
app.get('/api/menu/category/:category', getMenuItemsByCategory);
app.get('/api/menu/:id', getMenuItemById);
app.post('/api/cart/add', addToCart);
app.post('/api/cart/remove', removeFromCart);
app.get('/api/cart/history/:customerId', getCartHistory);
app.post('/api/orders', createOrder);
app.get('/api/orders/customer/:customerId', getOrdersByCustomerId);
app.get('/api/orders/:orderId', getOrderById);
app.get('/health', healthCheck); 