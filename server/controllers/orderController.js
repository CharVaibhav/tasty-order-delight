const MongoOrder = require('../models/Order');
const PgOrder = require('../models/pg/Order');
const PgCustomer = require('../models/pg/Customer');

// Create a new order - stores in both MongoDB and PostgreSQL
exports.createOrder = async (req, res) => {
  try {
    console.log('Received order creation request');
    console.log('Request body:', JSON.stringify(req.body));
    
    const { customerInfo, items, subtotal, discount, total, paymentInfo } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items data:', items);
      return res.status(400).json({
        success: false,
        error: 'Invalid items data. Items must be a non-empty array.'
      });
    }
    
    if (!customerInfo || !customerInfo.email) {
      console.error('Invalid customer info:', customerInfo);
      return res.status(400).json({
        success: false,
        error: 'Invalid customer information. Email is required.'
      });
    }
    
    // Check if user is authenticated
    const userId = req.user ? req.user._id : null;
    console.log('User ID:', userId || 'Guest order (no user ID)');
    
    // 1. Store in MongoDB (for backward compatibility and quick access)
    console.log('Creating MongoDB order...');
    const mongoOrder = new MongoOrder({
      user: userId,
      items,
      customerInfo,
      paymentInfo,
      subtotal,
      discount: discount || 0,
      total,
      status: 'pending',
      paymentStatus: 'completed'
    });
    
    console.log('Saving MongoDB order...');
    const savedMongoOrder = await mongoOrder.save();
    console.log('MongoDB order saved successfully with ID:', savedMongoOrder._id);
    
    // 2. Store in PostgreSQL (for relational data and complex queries)
    try {
      console.log('Attempting to save order in PostgreSQL...');
      
      // Find or create customer in PostgreSQL
      console.log('Finding or creating customer in PostgreSQL...');
      const pgCustomer = await PgCustomer.findOrCreate({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address
      });
      console.log('PostgreSQL customer:', pgCustomer);
      
      // Format items for PostgreSQL
      console.log('Formatting items for PostgreSQL...');
      const pgItems = items.map(item => ({
        product_id: item._id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      }));
      
      // Create order in PostgreSQL
      console.log('Creating PostgreSQL order...');
      const pgOrder = await PgOrder.create({
        customer_id: pgCustomer.id,
        subtotal,
        discount: discount || 0,
        total,
        status: 'pending',
        payment_status: 'completed',
        items: pgItems
      });
      console.log('PostgreSQL order created with ID:', pgOrder.id);
      
      // Add PostgreSQL order ID to MongoDB order for reference
      console.log('Updating MongoDB order with PostgreSQL order ID...');
      mongoOrder.pgOrderId = pgOrder.id;
      await mongoOrder.save();
      
      // Return success response with MongoDB order (for backward compatibility)
      console.log('Order successfully created in both databases');
      return res.status(201).json({
        success: true,
        data: mongoOrder,
        message: 'Order created successfully'
      });
      
    } catch (pgError) {
      console.error('PostgreSQL order creation error:', pgError);
      // If PostgreSQL fails, we still have the MongoDB order
      // Log the error but don't fail the request
      console.log('Order created in MongoDB only');
      return res.status(201).json({
        success: true,
        data: mongoOrder,
        warning: 'Order created in primary database only. Some features may be limited.'
      });
    }
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    // Try to get orders from PostgreSQL first (more reliable for complex queries)
    try {
      // Find customer by email
      const customer = await PgCustomer.findByEmail(req.user.email);
      
      if (customer) {
        // Get orders from PostgreSQL
        const pgOrders = await PgOrder.findByCustomerId(customer.id);
        
        return res.status(200).json({
          success: true,
          count: pgOrders.length,
          data: pgOrders
        });
      }
    } catch (pgError) {
      console.error('PostgreSQL get orders error:', pgError);
      // Fall back to MongoDB if PostgreSQL fails
    }
    
    // Fallback to MongoDB
    const mongoOrders = await MongoOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: mongoOrders.length,
      data: mongoOrders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get specific order
exports.getOrderById = async (req, res) => {
  try {
    // Try PostgreSQL first
    try {
      // Find customer by email
      const customer = await PgCustomer.findByEmail(req.user.email);
      
      if (customer) {
        // Get order from PostgreSQL
        const pgOrder = await PgOrder.findById(req.params.id);
        
        if (pgOrder && pgOrder.customer_id === customer.id) {
          return res.status(200).json({
            success: true,
            data: pgOrder
          });
        }
      }
    } catch (pgError) {
      console.error('PostgreSQL get order error:', pgError);
      // Fall back to MongoDB if PostgreSQL fails
    }
    
    // Fallback to MongoDB
    const mongoOrder = await MongoOrder.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!mongoOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mongoOrder
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get orders by phone number (for guest orders)
exports.getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    // Try PostgreSQL first
    try {
      // Find customer by phone
      const customer = await PgCustomer.findByPhone(phone);
      
      if (customer) {
        // Get orders from PostgreSQL
        const pgOrders = await PgOrder.findByCustomerId(customer.id);
        
        return res.status(200).json({
          success: true,
          count: pgOrders.length,
          data: pgOrders
        });
      }
    } catch (pgError) {
      console.error('PostgreSQL get orders by phone error:', pgError);
      // Fall back to MongoDB if PostgreSQL fails
    }
    
    // Fallback to MongoDB
    const mongoOrders = await MongoOrder.find({ 
      'customerInfo.phone': phone 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: mongoOrders.length,
      data: mongoOrders
    });
  } catch (error) {
    console.error('Get orders by phone error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Update in both databases
    let mongoOrder = null;
    let pgOrder = null;
    
    // Update in MongoDB
    try {
      mongoOrder = await MongoOrder.findById(id);
      if (mongoOrder) {
        mongoOrder.status = status;
        await mongoOrder.save();
      }
    } catch (mongoError) {
      console.error('MongoDB update order status error:', mongoError);
    }
    
    // Update in PostgreSQL
    try {
      pgOrder = await PgOrder.updateStatus(id, status);
    } catch (pgError) {
      console.error('PostgreSQL update order status error:', pgError);
    }
    
    // If both updates failed, return error
    if (!mongoOrder && !pgOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or could not be updated'
      });
    }
    
    // Return the updated order (prefer PostgreSQL if available)
    res.status(200).json({
      success: true,
      data: pgOrder || mongoOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if order exists and belongs to user in MongoDB
    const mongoOrder = await MongoOrder.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!mongoOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (mongoOrder.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel order at this stage'
      });
    }
    
    // Update in both databases
    // Update in MongoDB
    mongoOrder.status = 'cancelled';
    await mongoOrder.save();
    
    // Update in PostgreSQL
    try {
      await PgOrder.updateStatus(id, 'cancelled');
    } catch (pgError) {
      console.error('PostgreSQL cancel order error:', pgError);
      // Continue even if PostgreSQL update fails
    }
    
    res.status(200).json({
      success: true,
      data: mongoOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};