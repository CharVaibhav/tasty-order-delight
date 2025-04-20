# Dual-Database Implementation for The Digital Diner

This document outlines the implementation details of the dual-database architecture used in The Digital Diner restaurant ordering system.

## Architecture Overview

The application uses both MongoDB and PostgreSQL databases, each serving different purposes:

- **MongoDB**: Used for menu items, cart operations, and as a backup for orders
- **PostgreSQL**: Used for customer information and orders, providing relational data capabilities

## Implementation Details

### Database Configuration

1. **MongoDB Configuration** (`server/config/db.js`)
   - Handles connection to MongoDB Atlas or local MongoDB instance
   - Implements retry logic for connection failures
   - Sets up connection event handlers

2. **PostgreSQL Configuration** (`server/config/postgres.js`)
   - Creates a connection pool to PostgreSQL
   - Provides functions for testing connection and initializing tables
   - Implements a query helper function

### Data Models

1. **MongoDB Models**
   - `Menu.js`: Schema for menu items
   - `Order.js`: Schema for orders with a reference to PostgreSQL order ID
   - `User.js`: Schema for user authentication

2. **PostgreSQL Models**
   - `Customer.js`: Functions for CRUD operations on customers table
   - `Order.js`: Functions for CRUD operations on orders and order_items tables

### Controllers

1. **Order Controller** (`server/controllers/orderController.js`)
   - Implements dual-write pattern for creating orders in both databases
   - Provides fallback to MongoDB if PostgreSQL operations fail
   - Maintains data consistency between databases

### API Routes

1. **Order Routes** (`server/routes/orders.js`)
   - Endpoints for creating, retrieving, and updating orders
   - Supports both authenticated and guest orders
   - Includes endpoint for retrieving orders by phone number

### Database Initialization

1. **Server Startup** (`server/index.js`)
   - Attempts to connect to both databases on startup
   - Starts the server if at least one database is available
   - Implements retry logic for database connections

2. **Database Seeding** (`server/scripts/seed-postgres.js`)
   - Creates required tables in PostgreSQL
   - Seeds initial customer data

## Error Handling and Fallbacks

1. **Connection Failures**
   - The application can start with only one database available
   - Implements retry logic for database connections

2. **Operation Failures**
   - Falls back to MongoDB if PostgreSQL operations fail
   - Logs errors but continues operation when possible

3. **Health Check Endpoint**
   - Provides status information for both databases
   - Returns appropriate HTTP status codes based on database availability

## Data Consistency

1. **Cross-Database References**
   - MongoDB orders include a reference to PostgreSQL order ID
   - Enables data reconciliation between databases

2. **Transactions**
   - Uses transactions in PostgreSQL for multi-table operations
   - Ensures data integrity within each database

## Future Improvements

1. **Data Synchronization**
   - Implement a background job to synchronize data between databases
   - Handle cases where one database was temporarily unavailable

2. **Read/Write Splitting**
   - Optimize read operations to use the most appropriate database
   - Implement caching for frequently accessed data

3. **Monitoring**
   - Add more detailed monitoring of database operations
   - Implement alerts for database connection issues