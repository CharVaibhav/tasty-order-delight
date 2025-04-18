import { pgPool } from '../config';

export const createCustomerTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pgPool.query(createTableQuery);
    console.log('Customer table created successfully');
  } catch (error) {
    console.error('Error creating customer table:', error);
    throw error;
  }
};

export const Customer = {
  async create(customerData: {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  }) {
    const query = `
      INSERT INTO customers (customer_id, first_name, last_name, email, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const values = [
      customerData.customerId,
      customerData.firstName,
      customerData.lastName,
      customerData.email,
      customerData.phone,
      customerData.address,
    ];

    try {
      const result = await pgPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async getById(customerId: string) {
    const query = 'SELECT * FROM customers WHERE customer_id = $1;';
    try {
      const result = await pgPool.query(query, [customerId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  async update(customerId: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE customers
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE customer_id = $1
      RETURNING *;
    `;

    const values = [customerId, ...Object.values(updateData)];

    try {
      const result = await pgPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
}; 