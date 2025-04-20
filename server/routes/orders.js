const express = require('express');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Create new order - allows both authenticated and guest orders
router.post('/', async (req, res, next) => {
  try {
    // Check if user is authenticated
    const userId = req.user ? req.user._id : null;
    
    const order = new Order({
      ...req.body,
      user: userId // Will be null for guest orders
    });
    
    await order.save();
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// Get specific order
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Update order status (admin only)
router.patch('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = req.body.status;
    await order.save();
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel order at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 