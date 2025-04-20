import express from 'express';
const app = express();

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test API is running' });
});

// Test auth routes
app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  res.status(201).json({
    _id: '123456789',
    name: req.body.name,
    email: req.body.email,
    role: 'user',
    token: 'test-token-123'
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  res.json({
    _id: '123456789',
    name: 'Test User',
    email: req.body.email,
    role: 'user',
    token: 'test-token-123'
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test API server running on port ${PORT}`);
});