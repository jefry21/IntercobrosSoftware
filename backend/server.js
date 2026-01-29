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

// Generate 100 mock clients for pagination testing with realistic data
const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Pedro', 'Sofia'];
const apellidos = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'];
const calles = ['Av. Principal', 'Calle Central', 'Blvd. del Sol', 'Av. Libertad', 'Calle las Flores', 'Av. República', 'Calle Mayor', 'Paseo Colón', 'Av. Kennedy', 'Calle Real'];
const ciudades = ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choloma', 'El Progreso', 'Comayagua', 'Choluteca', 'Danlí', 'Juticalpa', 'Santa Rosa de Copán'];
const colonias = ['Col. Kennedy', 'Col. Palmira', 'Col. Alameda', 'Col. Loma Linda', 'Col. Las Minitas', 'Barrio El Centro', 'Col. Saturno', 'Res. Los Castaños', 'Col. Tropical', 'Barrio Guacerique'];
const empresas = ['Banco Central', 'Supermercados La Colonia', 'Corporación Dinant', 'Grupo Terra', 'Hospital San Felipe', 'Universidad Nacional', 'Grupo Intur', 'Banco Atlántida', 'Grupo Continental', 'Cervecería Hondureña'];

for (let i = 1; i <= 100; i++) {
  const nombre = nombres[i % nombres.length];
  const apellido = apellidos[Math.floor(i / 10) % apellidos.length];
  const apellido2 = apellidos[(i + 5) % apellidos.length];
  const ciudad = ciudades[i % ciudades.length];
  const colonia = colonias[i % colonias.length];
  const empresa = empresas[i % empresas.length];
  
  clients.push({
    id: i,
    name: `${nombre} ${apellido} ${apellido2}`,
    email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@example.com`,
    phone: `+504 9${String(Math.floor(100 + i)).substring(0, 3)}-${String((i * 11) % 9999).padStart(4, '0')}`,
    dni: `${String(Math.floor(100000000 + i * 123456)).substring(0, 13)}`,
    phoneHome: `+504 2${String(Math.floor(200 + i * 2)).substring(0, 3)}-${String((i * 3) % 9999).padStart(4, '0')}`,
    phoneWork: `+504 2${String(Math.floor(500 + i * 3)).substring(0, 3)}-${String((i * 7) % 9999).padStart(4, '0')}`,
    addressHome: `${calles[i % calles.length]} #${i}-${(i * 2) % 100}, ${colonia}, ${ciudad}`,
    addressWork: `${empresas[i % empresas.length]}, ${calles[(i + 3) % calles.length]} #${(i * 2) % 500}, ${ciudades[(i + 2) % ciudades.length]}`
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
  const { name, email, phone, dni, phoneHome, phoneWork, addressHome, addressWork } = req.body;
  const newClient = { 
    id: clients.length + 1, 
    name, 
    email, 
    phone, 
    dni, 
    phoneHome, 
    phoneWork, 
    addressHome, 
    addressWork 
  };
  clients.push(newClient);
  res.json(newClient);
});

app.put('/clients/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  const { name, email, phone, dni, phoneHome, phoneWork, addressHome, addressWork } = req.body;
  client.name = name;
  client.email = email;
  client.phone = phone;
  client.dni = dni;
  client.phoneHome = phoneHome;
  client.phoneWork = phoneWork;
  client.addressHome = addressHome;
  client.addressWork = addressWork;
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