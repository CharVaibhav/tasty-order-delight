# The Digital Diner - Restaurant Ordering System

A full-stack web application for "The Digital Diner" restaurant, allowing customers to browse the menu, add items to a cart, and place pickup orders.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Databases**: 
  - MongoDB (for menu items and cart operations)
  - PostgreSQL (for customer information and orders)

## Database Design Justification

The application uses a dual-database approach, leveraging the strengths of both MongoDB and PostgreSQL for different types of data:

### MongoDB
- **Menu Items**: Used for storing menu items due to its flexible schema, allowing for easy addition of new fields or categories without schema migrations. Menu items can have varying attributes based on category (e.g., beverages might have volume information while main dishes have calorie counts).
- **Cart Operations**: Used for tracking cart operations (add/remove) as it's event-based data that doesn't require complex relationships. The document-based structure allows for efficient storage of the current cart state.
- **Backup for Orders**: Orders are also stored in MongoDB for redundancy and to support legacy code that expects MongoDB's document structure.

### PostgreSQL
- **Customer Information**: Used for storing structured customer data due to its relational nature and ACID properties. Customer data benefits from PostgreSQL's constraints and transaction support to ensure data integrity.
- **Orders**: Used for storing order information as it requires relationships between customers and order items. The relational model allows for complex queries across orders, customers, and items.
- **Order Items**: Stored in a separate table with foreign key relationships to orders, enabling efficient reporting and analytics on popular items, sales trends, etc.

### Implementation Details
- The application maintains data consistency by writing to both databases when creating orders
- PostgreSQL is the primary source for customer and order data, with MongoDB as a fallback
- Cross-database references are maintained to link records between the two databases

## Features

- **Menu Display**: Browse menu items by category
- **Shopping Cart**: Add/remove items, view cart contents and total price
- **Order Placement**: Submit orders with customer information
- **Order History**: View past orders associated with a customer

## API Endpoints

### Menu (MongoDB)
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `GET /api/menu/:id` - Get a specific menu item

### Cart (MongoDB)
- `POST /api/cart/add` - Add an item to the cart
- `POST /api/cart/remove` - Remove an item from the cart
- `GET /api/cart/history/:customerId` - Get cart history for a customer

### Orders (PostgreSQL & MongoDB)
- `POST /api/orders` - Create a new order (stored in both databases)
- `GET /api/orders` - Get orders for the authenticated user
- `GET /api/orders/:id` - Get a specific order by ID
- `GET /api/orders/phone/:phone` - Get orders for a specific phone number (for guest orders)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `PATCH /api/orders/:id/cancel` - Cancel an order

### Authentication (MongoDB)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- PostgreSQL (v12 or higher)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/tasty_order_delight

# PostgreSQL Configuration
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=tasty_order_delight
PG_PASSWORD=postgres
PG_PORT=5432

# Server Configuration
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### PostgreSQL Setup

Before running the application, you need to create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE tasty_order_delight;

# Exit psql
\q
```

The application will automatically create the necessary tables when it starts.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digital-diner.git
   cd digital-diner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the databases:
   - Make sure MongoDB is running
   - Create the PostgreSQL database as described in the PostgreSQL Setup section
   - Seed the PostgreSQL database with initial data:
     ```bash
     npm run seed:postgres
     ```

4. Start the backend server:
   ```bash
   npm run server:dev
   ```

5. In a separate terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

6. For full-stack development with both servers running concurrently:
   ```bash
   npm run dev:full
   ```

## Deployment

### Frontend (Netlify)

1. Build the frontend:
   ```
   npm run build
   ```

2. Deploy to Netlify:
   - Create an account on [Netlify](https://www.netlify.com/)
   - Connect your GitHub repository to Netlify
   - Set the build command to `npm run build`
   - Set the publish directory to `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)

3. Alternatively, use the Netlify CLI:
   ```
   npm install -g netlify-cli
   netlify login
   netlify deploy --dir=dist --prod
   ```

4. For local testing with a mock API:
   - Create a `.env` file in the root directory with:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Run the development server:
     ```
     npm run dev
     ```

## Assumptions and Challenges

### Assumptions
- Customers are identified by their phone number or email
- Basic user authentication is implemented but not required for placing orders
- Orders are for pickup only (no delivery)
- The application should work even if one of the databases is temporarily unavailable

### Challenges and Solutions

#### Dual Database Management
- **Challenge**: Managing state between MongoDB and PostgreSQL
- **Solution**: Implemented a dual-write pattern where data is written to both databases with MongoDB as a fallback if PostgreSQL is unavailable

#### Data Consistency
- **Challenge**: Ensuring data consistency across databases
- **Solution**: Used transactions in PostgreSQL and maintained cross-database references to link records between MongoDB and PostgreSQL

#### Error Handling
- **Challenge**: Gracefully handling database connection failures
- **Solution**: Implemented retry logic and fallback mechanisms to ensure the application remains functional even if one database is temporarily unavailable

#### Performance Optimization
- **Challenge**: Balancing performance with data integrity
- **Solution**: Used MongoDB for read-heavy operations (menu items) and PostgreSQL for complex relational data (orders and customers)

## License

MIT
