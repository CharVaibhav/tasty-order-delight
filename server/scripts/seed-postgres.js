const { Pool } = require('pg');
require('dotenv').config();

// Sample customer data
const customers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    address: '123 Main St, Bangalore'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 87654 32109',
    address: '456 Park Ave, Mumbai'
  }
];

// Connect to PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'tasty_order_delight',
  password: process.env.PG_PASSWORD || 'postgres',
  port: process.env.PG_PORT || 5432,
});

// Seed the database
async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting PostgreSQL database seeding...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        payment_status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample customers
    for (const customer of customers) {
      // Check if customer already exists
      const existingCustomer = await client.query(
        'SELECT * FROM customers WHERE email = $1',
        [customer.email]
      );
      
      if (existingCustomer.rows.length === 0) {
        await client.query(
          'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4)',
          [customer.name, customer.email, customer.phone, customer.address]
        );
        console.log(`Added customer: ${customer.name}`);
      } else {
        console.log(`Customer already exists: ${customer.name}`);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('PostgreSQL database seeding completed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error seeding PostgreSQL database:', error);
  } finally {
    // Release client
    client.release();
    // Close pool
    await pool.end();
  }
}

// Run the seed function
seedDatabase().catch(console.error);