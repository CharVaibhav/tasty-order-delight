const db = require('../../config/postgres');

const Customer = {
  // Create a new customer
  async create(customerData) {
    const { name, email, phone, address } = customerData;
    
    try {
      const result = await db.query(
        'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, phone, address]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  
  // Find a customer by email
  async findByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM customers WHERE email = $1',
        [email]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding customer by email:', error);
      throw error;
    }
  },
  
  // Find a customer by phone
  async findByPhone(phone) {
    try {
      const result = await db.query(
        'SELECT * FROM customers WHERE phone = $1',
        [phone]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding customer by phone:', error);
      throw error;
    }
  },
  
  // Find a customer by ID
  async findById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM customers WHERE id = $1',
        [id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error finding customer by ID:', error);
      throw error;
    }
  },
  
  // Update a customer
  async update(id, customerData) {
    const { name, email, phone, address } = customerData;
    
    try {
      const result = await db.query(
        'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [name, email, phone, address, id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },
  
  // Find or create a customer
  async findOrCreate(customerData) {
    try {
      // Try to find by email first
      let customer = await this.findByEmail(customerData.email);
      
      // If not found, try to find by phone if provided
      if (!customer && customerData.phone) {
        customer = await this.findByPhone(customerData.phone);
      }
      
      // If still not found, create a new customer
      if (!customer) {
        customer = await this.create(customerData);
      }
      
      return customer;
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      throw error;
    }
  }
};

module.exports = Customer;