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

// Avales data
const avales = [];

// Generate 50 mock avales
for (let i = 1; i <= 50; i++) {
  const nombre = nombres[i % nombres.length];
  const apellido = apellidos[Math.floor(i / 5) % apellidos.length];
  const apellido2 = apellidos[(i + 3) % apellidos.length];
  const ciudad = ciudades[i % ciudades.length];
  const colonia = colonias[i % colonias.length];
  
  avales.push({
    id: i,
    name: `${nombre} ${apellido} ${apellido2}`,
    email: `${nombre.toLowerCase()}.aval${i}@example.com`,
    phone: `+504 9${String(Math.floor(500 + i)).substring(0, 3)}-${String((i * 13) % 9999).padStart(4, '0')}`,
    dni: `${String(Math.floor(200000000 + i * 234567)).substring(0, 13)}`,
    phoneHome: `+504 2${String(Math.floor(300 + i * 2)).substring(0, 3)}-${String((i * 5) % 9999).padStart(4, '0')}`,
    phoneWork: `+504 2${String(Math.floor(600 + i * 3)).substring(0, 3)}-${String((i * 9) % 9999).padStart(4, '0')}`,
    addressHome: `${calles[(i + 2) % calles.length]} #${(i * 3) % 100}-${(i * 4) % 100}, ${colonia}, ${ciudad}`,
    addressWork: `${empresas[(i + 5) % empresas.length]}, ${calles[(i + 7) % calles.length]} #${(i * 5) % 500}, ${ciudades[(i + 4) % ciudades.length]}`
  });
}

// Avales routes
app.get('/avales', authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = avales.slice(start, end);
  res.json({ avales: paginated, total: avales.length, page, limit });
});

app.post('/avales', authenticate, (req, res) => {
  const { name, email, phone, dni, phoneHome, phoneWork, addressHome, addressWork } = req.body;
  const newAval = { 
    id: avales.length + 1, 
    name, 
    email, 
    phone, 
    dni, 
    phoneHome, 
    phoneWork, 
    addressHome, 
    addressWork 
  };
  avales.push(newAval);
  res.json(newAval);
});

app.put('/avales/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const aval = avales.find(a => a.id === id);
  if (!aval) return res.status(404).json({ message: 'Aval not found' });
  const { name, email, phone, dni, phoneHome, phoneWork, addressHome, addressWork } = req.body;
  aval.name = name;
  aval.email = email;
  aval.phone = phone;
  aval.dni = dni;
  aval.phoneHome = phoneHome;
  aval.phoneWork = phoneWork;
  aval.addressHome = addressHome;
  aval.addressWork = addressWork;
  res.json(aval);
});

app.delete('/avales/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = avales.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Aval not found' });
  avales.splice(index, 1);
  res.json({ message: 'Aval deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Pagos - almacenamiento en memoria
const pagos = [];
let pagoIdCounter = 1;

// Generar pagos ficticios para los primeros 100 clientes
const metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'];
const notasEjemplo = [
  'Pago mensual',
  'Abono a cuenta',
  'Pago quincenal',
  'Pago regular',
  'Cuota del mes',
  '',
  'Pago adelantado',
  'Abono extra'
];

// Función para generar números pseudo-aleatorios basados en una semilla
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

for (let clienteId = 1; clienteId <= 100; clienteId++) {
  // Usar el mismo cálculo que en Cobros.js frontend para que coincidan
  const saldoInicial = Math.floor(seededRandom(clienteId * 1.5) * 50000) + 10000;
  const pagosRealizados = Math.floor(seededRandom(clienteId * 2.3) * 12);
  
  if (pagosRealizados > 0) {
    const montoPorPago = (saldoInicial / 24); // Aproximado
    
    for (let i = 0; i < pagosRealizados; i++) {
      // Generar fechas progresivas en el pasado (más reciente = menor i)
      const diasAtras = (pagosRealizados - i) * 30 + Math.floor(seededRandom(clienteId * i + 100) * 15);
      const fechaPago = new Date();
      fechaPago.setDate(fechaPago.getDate() - diasAtras);
      
      // Variar un poco el monto
      const variacion = 0.8 + (seededRandom(clienteId * i + 50) * 0.4); // 80% a 120%
      const monto = montoPorPago * variacion;
      
      pagos.push({
        id: pagoIdCounter++,
        clienteId: clienteId,
        monto: parseFloat(monto.toFixed(2)),
        metodoPago: metodosPago[Math.floor(seededRandom(clienteId * i + 200) * metodosPago.length)],
        referencia: seededRandom(clienteId * i + 300) > 0.5 ? `REF-${String(10000 + pagoIdCounter).padStart(6, '0')}` : '',
        notas: notasEjemplo[Math.floor(seededRandom(clienteId * i + 400) * notasEjemplo.length)],
        fecha: fechaPago.toISOString()
      });
    }
  }
}

// Obtener historial de pagos de un cliente
app.get('/pagos/:clienteId', authenticate, (req, res) => {
  const clienteId = parseInt(req.params.clienteId);
  const pagosByCliente = pagos.filter(p => p.clienteId === clienteId);
  res.json({ pagos: pagosByCliente, total: pagosByCliente.length });
});

// Registrar un nuevo pago
app.post('/pagos', authenticate, (req, res) => {
  const { clienteId, monto, metodoPago, referencia, notas } = req.body;
  const nuevoPago = {
    id: pagoIdCounter++,
    clienteId: parseInt(clienteId),
    monto: parseFloat(monto),
    metodoPago,
    referencia: referencia || '',
    notas: notas || '',
    fecha: new Date().toISOString()
  };
  pagos.push(nuevoPago);
  res.json(nuevoPago);
});
