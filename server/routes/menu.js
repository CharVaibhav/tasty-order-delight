const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
router.get('/category/:category', async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get popular menu items
// @route   GET /api/menu/popular
// @access  Public
router.get('/popular', async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ isPopular: true });
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 