import { pgPool } from '../config';

export const createOrderTables = async () => {
  // Create orders table
  const createOrdersTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(255) UNIQUE NOT NULL,
      customer_id VARCHAR(255) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );
  `;

  // Create order items table
  const createOrderItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(255) NOT NULL,
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    );
  `;

  try {
    await pgPool.query(createOrdersTableQuery);
    await pgPool.query(createOrderItemsTableQuery);
    console.log('Order tables created successfully');
  } catch (error) {
    console.error('Error creating order tables:', error);
    throw error;
  }
};

export const Order = {
  async create(orderData: {
    orderId: string;
    customerId: string;
    totalAmount: number;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert order
      const orderQuery = `
        INSERT INTO orders (order_id, customer_id, total_amount, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      
      const orderResult = await client.query(orderQuery, [
        orderData.orderId,
        orderData.customerId,
        orderData.totalAmount,
        'pending'
      ]);
      
      // Insert order items
      for (const item of orderData.items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
          VALUES ($1, $2, $3, $4, $5);
        `;
        
        await client.query(itemQuery, [
          orderData.orderId,
          item.productId,
          item.productName,
          item.quantity,
          item.price
        ]);
      }
      
      await client.query('COMMIT');
      return orderResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async getByCustomerId(customerId: string) {
    const query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'productId', oi.product_id,
               'productName', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.customer_id = $1
      GROUP BY o.id, o.order_id, o.customer_id, o.total_amount, o.status, o.created_at, o.updated_at
      ORDER BY o.created_at DESC;
    `;
    
    try {
      const result = await pgPool.query(query, [customerId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getByOrderId(orderId: string) {
    const query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'productId', oi.product_id,
               'productName', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.order_id = $1
      GROUP BY o.id, o.order_id, o.customer_id, o.total_amount, o.status, o.created_at, o.updated_at;
    `;
    
    try {
      const result = await pgPool.query(query, [orderId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async updateStatus(orderId: string, status: string) {
    const query = `
      UPDATE orders
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $1
      RETURNING *;
    `;
    
    try {
      const result = await pgPool.query(query, [orderId, status]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 