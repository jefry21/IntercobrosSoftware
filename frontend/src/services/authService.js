import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Servicio de autenticación
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  // Aquí se pueden agregar más métodos como logout, register, etc.
};

// Servicio de clientes
export const clientsService = {
  getClients: async (page = 1, limit = 10) => {
    const response = await api.get(`/clients?page=${page}&limit=${limit}`);
    return response.data;
  },
  createClient: async (client) => {
    const response = await api.post('/clients', client);
    return response.data;
  },
  updateClient: async (id, client) => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// Servicio de avales
export const avalesService = {
  getAvales: async (page = 1, limit = 10) => {
    const response = await api.get(`/avales?page=${page}&limit=${limit}`);
    return response.data;
  },
  createAval: async (aval) => {
    const response = await api.post('/avales', aval);
    return response.data;
  },
  updateAval: async (id, aval) => {
    const response = await api.put(`/avales/${id}`, aval);
    return response.data;
  },
  deleteAval: async (id) => {
    const response = await api.delete(`/avales/${id}`);
    return response.data;
  },
};

// Servicio de pagos
export const pagosService = {
  getPagos: async (clienteId) => {
    const response = await api.get(`/pagos/${clienteId}`);
    return response.data;
  },
  createPago: async (pago) => {
    const response = await api.post('/pagos', pago);
    return response.data;
  },
};

export default api;