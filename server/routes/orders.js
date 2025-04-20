const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Create new order - allows both authenticated and guest orders
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/', protect, orderController.getUserOrders);

// Get specific order
router.get('/:id', protect, orderController.getOrderById);

// Get orders by phone number (for guest orders)
router.get('/phone/:phone', orderController.getOrdersByPhone);

// Update order status (admin only)
router.patch('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router; 