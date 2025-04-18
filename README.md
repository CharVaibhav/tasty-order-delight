# The Digital Diner - Restaurant Ordering System

A full-stack web application for "The Digital Diner" restaurant, allowing customers to browse the menu, add items to a cart, and place pickup orders.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express
- **Databases**: 
  - MongoDB (for menu items and cart operations)
  - PostgreSQL (for customer information and orders)

## Database Design Justification

### MongoDB
- **Menu Items**: Used for storing menu items due to its flexible schema, allowing for easy addition of new fields or categories without schema migrations.
- **Cart Operations**: Used for tracking cart operations (add/remove) as it's event-based data that doesn't require complex relationships.

### PostgreSQL
- **Customer Information**: Used for storing structured customer data due to its relational nature and ACID properties.
- **Orders**: Used for storing order information as it requires relationships between customers and order items, and benefits from PostgreSQL's transaction support.

## Features

- **Menu Display**: Browse menu items by category
- **Shopping Cart**: Add/remove items, view cart contents and total price
- **Order Placement**: Submit orders with customer information
- **Order History**: View past orders associated with a customer

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `GET /api/menu/:id` - Get a specific menu item

### Cart
- `POST /api/cart/add` - Add an item to the cart
- `POST /api/cart/remove` - Remove an item from the cart
- `GET /api/cart/history/:customerId` - Get cart history for a customer

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/customer/:customerId` - Get orders for a customer
- `GET /api/orders/:orderId` - Get a specific order

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- PostgreSQL (v12 or higher)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2

# PostgreSQL Configuration
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=tasty_order_delight
PG_PASSWORD=postgres
PG_PORT=5432

# Server Configuration
PORT=5000
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/digital-diner.git
   cd digital-diner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Start the backend server:
   ```
   npm run server:dev
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
- No user authentication is required for this prototype
- Orders are for pickup only (no delivery)

### Challenges
- Managing state between MongoDB and PostgreSQL
- Ensuring data consistency across databases
- Handling concurrent cart operations

## License

MIT
