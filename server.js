
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory user store (replace with database in production)
const users = [];

// Helper to find user
const findUser = (email) => users.find(u => u.email === email);

// Routes
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (findUser(email)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = { id: Date.now(), name, email, password }; // In real app, hash password!
  users.push(newUser);

  console.log(`New user registered: ${email}`);
  
  // Return user without password
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ user: userWithoutPass, token: 'fake-jwt-token' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = findUser(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log(`User logged in: ${email}`);

  const { password: _, ...userWithoutPass } = user;
  res.status(200).json({ user: userWithoutPass, token: 'fake-jwt-token' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- POST /api/signup`);
  console.log(`- POST /api/login`);
});
