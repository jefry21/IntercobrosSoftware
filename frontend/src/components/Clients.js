import React, { useState, useEffect, useCallback } from 'react';
import { clientsService } from '../services/authService';

function Clients() {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientsService.getClients(page);
      setClients(data.clients);
      setTotal(data.total);
    } catch (err) {
      alert('Error cargando clientes');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleAdd = () => {
    setEditingClient(null);
    setForm({ name: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setForm({ name: client.name, email: client.email, phone: client.phone });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar cliente?')) {
      try {
        await clientsService.deleteClient(id);
        loadClients();
      } catch (err) {
        alert('Error eliminando cliente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsService.updateClient(editingClient.id, form);
      } else {
        await clientsService.createClient(form);
      }
      setShowModal(false);
      loadClients();
    } catch (err) {
      alert('Error guardando cliente');
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Clientes</h2>

      {/* Search Input */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        <i className="bi bi-plus-circle"></i> Agregar Cliente
      </button>

      {/* Mostrar resultados de búsqueda */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <i className="bi bi-info-circle"></i> {filteredClients.length} cliente(s) encontrado(s) para "{searchTerm}"
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación - solo mostrar cuando no hay búsqueda */}
          {!searchTerm && (
            <nav aria-label="Paginación de clientes">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>Anterior</button>
                </li>
                <li className="page-item active">
                  <span className="page-link">Página {page}</span>
                </li>
                <li className={`page-item ${page * 10 >= total ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>Siguiente</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Modal para Agregar/Editar */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="modal-header bg-gradient-primary text-white" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderBottom: 'none',
                  padding: '1.5rem'
                }}>
                  <h5 className="modal-title d-flex align-items-center mb-0">
                    <i className={`bi ${editingClient ? 'bi-pencil-square' : 'bi-person-plus'} me-2 fs-4`}></i>
                    {editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                    aria-label="Cerrar"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label fw-bold text-muted mb-2">
                        <i className="bi bi-person-circle me-1"></i>Nombre Completo
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person-fill text-primary"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Ingrese el nombre completo"
                          required
                          style={{ borderRadius: '0 8px 8px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-bold text-muted mb-2">
                        <i className="bi bi-envelope me-1"></i>Correo Electrónico
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope-fill text-success"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0"
                          id="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="cliente@ejemplo.com"
                          required
                          style={{ borderRadius: '0 8px 8px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label fw-bold text-muted mb-2">
                        <i className="bi bi-telephone me-1"></i>Número de Teléfono
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-telephone-fill text-info"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="555-123-4567"
                          required
                          style={{ borderRadius: '0 8px 8px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light border-0 p-4" style={{ borderRadius: '0 0 15px 15px' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 py-2"
                      onClick={() => setShowModal(false)}
                      style={{ borderRadius: '8px', fontWeight: '500' }}
                    >
                      <i className="bi bi-x-circle me-1"></i>Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn px-4 py-2 ms-2"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        color: 'white'
                      }}
                    >
                      <i className={`bi ${editingClient ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                      {editingClient ? 'Actualizar Cliente' : 'Agregar Cliente'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" style={{ backdropFilter: 'blur(2px)' }}></div>
        </>
      )}
    </div>
  );
}

export default Clients;