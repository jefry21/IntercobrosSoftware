require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const users = []; // Mock database

// For demo, add a user
(async () => {
  const hash = await bcrypt.hash('password', 10);
  users.push({ id: 1, username: 'admin', password: hash });
})();

const clients = []; // Mock clients

// Generate 100 mock clients for pagination testing
for (let i = 1; i <= 100; i++) {
  clients.push({
    id: i,
    name: `Cliente ${i}`,
    email: `cliente${i}@example.com`,
    phone: `555-${String(i).padStart(4, '0')}`
  });
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Clients microservice routes
app.get('/clients', authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = clients.slice(start, end);
  res.json({ clients: paginated, total: clients.length, page, limit });
});

app.post('/clients', authenticate, (req, res) => {
  const { name, email, phone } = req.body;
  const newClient = { id: clients.length + 1, name, email, phone };
  clients.push(newClient);
  res.json(newClient);
});

app.put('/clients/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  const { name, email, phone } = req.body;
  client.name = name;
  client.email = email;
  client.phone = phone;
  res.json(client);
});

app.delete('/clients/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = clients.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ message: 'Client not found' });
  clients.splice(index, 1);
  res.json({ message: 'Client deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));