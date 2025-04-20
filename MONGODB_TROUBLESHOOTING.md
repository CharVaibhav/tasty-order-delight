# Troubleshooting MongoDB Connection Issues

If you're encountering MongoDB connection errors when deploying to Render, follow this guide to resolve them.

## Common MongoDB Connection Errors

### Authentication Failed Error

Error message: `MongoServerError: bad auth : Authentication failed`

This error occurs when MongoDB cannot authenticate with the provided credentials. Here's how to fix it:

1. **Check your connection string format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```
   - Make sure to include the database name after the hostname
   - Ensure all parts of the connection string are correct

2. **URL encode special characters in your password**:
   If your password contains special characters, they need to be URL encoded:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `&` → `%26`
   - `+` → `%2B`
   - `/` → `%2F`
   - `:` → `%3A`

3. **Verify user credentials in MongoDB Atlas**:
   - Log in to MongoDB Atlas
   - Go to "Database Access"
   - Check if the user exists with the correct username
   - Reset the password if necessary

4. **Check user permissions**:
   - Ensure the user has at least "readWrite" permissions on your database
   - Consider creating a new user with appropriate permissions

5. **Allow connections from Render**:
   - Go to MongoDB Atlas > "Network Access"
   - Add entry `0.0.0.0/0` to allow connections from anywhere
   - Or add Render's IP addresses specifically

## Testing Your MongoDB Connection

You can test your MongoDB connection locally before deploying:

1. Create a test file (e.g., `test-mongodb-connection.js`):
   ```javascript
   const mongoose = require('mongoose');
   require('dotenv').config();

   const uri = process.env.MONGODB_URI;
   console.log('Connection string (masked):', uri.replace(/:([^@]+)@/, ':****@'));

   mongoose.connect(uri)
     .then(() => {
       console.log('Connected to MongoDB successfully!');
       return mongoose.connection.close();
     })
     .then(() => console.log('Connection closed'))
     .catch(err => console.error('MongoDB connection error:', err));
   ```

2. Run the test:
   ```
   node test-mongodb-connection.js
   ```

## Updating Your Connection String in Render

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Update the `MONGODB_URI` variable
5. Click "Save Changes"
6. Trigger a manual deploy

## Still Having Issues?

If you're still experiencing connection problems:

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Verify your MongoDB Atlas cluster is active
3. Try creating a new database user with a simple password (no special characters)
4. Check if your MongoDB Atlas plan has connection limitations
5. Contact MongoDB Atlas support if the issue persists