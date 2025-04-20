const db = require('../../config/postgres');

const Order = {
  // Create a new order with items
  async create(orderData) {
    const { customer_id, subtotal, discount, total, status, payment_status, items } = orderData;
    
    // Start a transaction
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the order
      const orderResult = await client.query(
        'INSERT INTO orders (customer_id, subtotal, discount, total, status, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [customer_id, subtotal, discount || 0, total, status || 'pending', payment_status || 'pending']
      );
      
      const order = orderResult.rows[0];
      
      // Insert order items
      if (items && items.length > 0) {
        for (const item of items) {
          await client.query(
            'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, category) VALUES ($1, $2, $3, $4, $5, $6)',
            [order.id, item.product_id, item.product_name, item.quantity, item.price, item.category]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Return the complete order with items
      return await this.findById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', error);
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Find an order by ID with its items
  async findById(id) {
    try {
      // Get the order
      const orderResult = await db.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );
      
      if (orderResult.rows.length === 0) {
        return null;
      }
      
      const order = orderResult.rows[0];
      
      // Get the order items
      const itemsResult = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
      );
      
      // Combine order with items
      order.items = itemsResult.rows;
      
      return order;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      throw error;
    }
  },
  
  // Find orders by customer ID
  async findByCustomerId(customerId) {
    try {
      // Get all orders for the customer
      const ordersResult = await db.query(
        'SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC',
        [customerId]
      );
      
      const orders = ordersResult.rows;
      
      // For each order, get its items
      for (const order of orders) {
        const itemsResult = await db.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );
        
        order.items = itemsResult.rows;
      }
      
      return orders;
    } catch (error) {
      console.error('Error finding orders by customer ID:', error);
      throw error;
    }
  },
  
  // Update order status
  async updateStatus(id, status) {
    try {
      const result = await db.query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
  
  // Update payment status
  async updatePaymentStatus(id, paymentStatus) {
    try {
      const result = await db.query(
        'UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [paymentStatus, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

module.exports = Order;