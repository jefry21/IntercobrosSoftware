import React, { useState, useEffect, useCallback } from 'react';
import { avalesService } from '../services/authService';

function Avales() {
  const [avales, setAvales] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAval, setEditingAval] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    dni: '', 
    phoneHome: '', 
    phoneWork: '', 
    addressHome: '', 
    addressWork: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');

  const loadAvales = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Cargando avales, página:', page);
      const data = await avalesService.getAvales(page, 10);
      console.log('Datos recibidos:', data);
      setAvales(data.avales);
      setTotal(data.total);
    } catch (err) {
      console.error('Error detallado:', err);
      alert('Error cargando avales: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadAvales();
  }, [loadAvales]);

  const handleAdd = () => {
    setEditingAval(null);
    setForm({ 
      name: '', 
      email: '', 
      phone: '', 
      dni: '', 
      phoneHome: '', 
      phoneWork: '', 
      addressHome: '', 
      addressWork: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (aval) => {
    setEditingAval(aval);
    setForm({ 
      name: aval.name, 
      email: aval.email, 
      phone: aval.phone,
      dni: aval.dni || '',
      phoneHome: aval.phoneHome || '',
      phoneWork: aval.phoneWork || '',
      addressHome: aval.addressHome || '',
      addressWork: aval.addressWork || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar aval?')) {
      try {
        await avalesService.deleteAval(id);
        loadAvales();
      } catch (err) {
        alert('Error eliminando aval');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAval) {
        await avalesService.updateAval(editingAval.id, form);
      } else {
        await avalesService.createAval(form);
      }
      setShowModal(false);
      loadAvales();
    } catch (err) {
      alert('Error guardando aval');
    }
  };

  const filteredAvales = avales.filter(aval =>
    aval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aval.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aval.phone.includes(searchTerm) ||
    (aval.dni && aval.dni.includes(searchTerm)) ||
    (aval.phoneHome && aval.phoneHome.includes(searchTerm)) ||
    (aval.phoneWork && aval.phoneWork.includes(searchTerm)) ||
    (aval.addressHome && aval.addressHome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (aval.addressWork && aval.addressWork.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-3 shadow-sm" 
           style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
        <div>
          <h2 className="mb-1 fw-bold">
            <i className="bi bi-person-badge-fill me-2"></i>Gestión de Avales
          </h2>
          <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
            Administra y organiza la información de tus avales
          </p>
        </div>
        <div className="bg-white bg-opacity-25 px-3 py-2 rounded-3">
          <i className="bi bi-shield-check fs-5 me-2"></i>
          <span className="fw-bold">{total}</span> Avales
        </div>
      </div>

      <div className="row mb-3 g-3">
        <div className="col-md-8">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
              <i className="bi bi-search text-danger"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar por nombre, email, DNI, teléfonos o direcciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem', padding: '0.6rem 1rem' }}
            />
          </div>
        </div>
        <div className="col-md-4 text-end">
          <button 
            className="btn btn-lg shadow-sm w-100" 
            onClick={handleAdd}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '600',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Nuevo Aval
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="alert alert-info mb-3 shadow-sm border-0" style={{ borderRadius: '10px' }}>
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>{filteredAvales.length}</strong> aval(es) encontrado(s) para <strong>"{searchTerm}"</strong>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando avales...</p>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.9rem' }}>
                <thead style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-hash me-1"></i>ID
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-person me-1"></i>Nombre Completo
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-card-text me-1"></i>DNI
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-envelope me-1"></i>Email
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-phone me-1"></i>Celular
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-house me-1"></i>Tel. Casa
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-building me-1"></i>Tel. Trabajo
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-geo-alt me-1"></i>Dirección Casa
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none' }}>
                      <i className="bi bi-briefcase me-1"></i>Dirección Trabajo
                    </th>
                    <th style={{ padding: '1rem 0.75rem', fontWeight: '600', borderBottom: 'none', textAlign: 'center' }}>
                      <i className="bi bi-gear me-1"></i>Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvales.map((a, index) => (
                    <tr key={a.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa', transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1" style={{ borderRadius: '6px' }}>
                          #{a.id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle', fontWeight: '500' }}>
                        {a.name}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <span className="font-monospace text-muted" style={{ fontSize: '0.85rem' }}>{a.dni}</span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <small className="text-muted">{a.email}</small>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <i className="bi bi-phone-fill text-danger me-1"></i>
                        <span style={{ fontSize: '0.88rem' }}>{a.phone}</span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.88rem' }}>{a.phoneHome}</span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.88rem' }}>{a.phoneWork}</span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle', maxWidth: '200px' }}>
                        <small className="text-muted d-block text-truncate" title={a.addressHome}>
                          {a.addressHome}
                        </small>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle', maxWidth: '200px' }}>
                        <small className="text-muted d-block text-truncate" title={a.addressWork}>
                          {a.addressWork}
                        </small>
                      </td>
                      <td style={{ padding: '1rem 0.75rem', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm shadow-sm" 
                            onClick={() => handleEdit(a)}
                            title="Editar aval"
                            style={{
                              backgroundColor: '#f093fb',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '6px 0 0 6px',
                              fontSize: '0.85rem'
                            }}
                          >
                            <i className="bi bi-pencil-fill me-1"></i>Editar
                          </button>
                          <button 
                            className="btn btn-sm shadow-sm" 
                            onClick={() => handleDelete(a.id)}
                            title="Eliminar aval"
                            style={{
                              backgroundColor: '#f5576c',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '0 6px 6px 0',
                              fontSize: '0.85rem'
                            }}
                          >
                            <i className="bi bi-trash-fill me-1"></i>Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!searchTerm && (
            <div className="d-flex justify-content-between align-items-center mt-4 px-3">
              <div className="text-muted">
                Mostrando <strong>{((page - 1) * 10) + 1}</strong> - <strong>{Math.min(page * 10, total)}</strong> de <strong>{total}</strong> avales
              </div>
              <nav aria-label="Paginación de avales">
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link shadow-sm" 
                      onClick={() => setPage(page - 1)}
                      style={{ border: 'none', borderRadius: '8px 0 0 8px', color: page === 1 ? '#6c757d' : '#f5576c', fontWeight: '500', padding: '0.5rem 1rem' }}
                    >
                      <i className="bi bi-chevron-left me-1"></i>Anterior
                    </button>
                  </li>
                  <li className="page-item active">
                    <span 
                      className="page-link shadow-sm" 
                      style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none', fontWeight: '600', padding: '0.5rem 1.2rem' }}
                    >
                      Página {page} de {Math.ceil(total / 10)}
                    </span>
                  </li>
                  <li className={`page-item ${page * 10 >= total ? 'disabled' : ''}`}>
                    <button 
                      className="page-link shadow-sm" 
                      onClick={() => setPage(page + 1)}
                      style={{ border: 'none', borderRadius: '0 8px 8px 0', color: page * 10 >= total ? '#6c757d' : '#f5576c', fontWeight: '500', padding: '0.5rem 1rem' }}
                    >
                      Siguiente<i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="modal-header text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderBottom: 'none', padding: '1.5rem' }}>
                  <h5 className="modal-title d-flex align-items-center mb-0">
                    <i className={`bi ${editingAval ? 'bi-pencil-square' : 'bi-person-plus'} me-2 fs-4`}></i>
                    {editingAval ? 'Editar Aval' : 'Agregar Nuevo Aval'}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Cerrar"></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-person me-1"></i>Nombre</label>
                      <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-envelope me-1"></i>Email</label>
                      <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-card-text me-1"></i>DNI</label>
                      <input type="text" className="form-control" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-phone me-1"></i>Celular</label>
                      <input type="text" className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold"><i className="bi bi-house me-1"></i>Tel. Casa</label>
                        <input type="text" className="form-control" value={form.phoneHome} onChange={(e) => setForm({ ...form, phoneHome: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold"><i className="bi bi-building me-1"></i>Tel. Trabajo</label>
                        <input type="text" className="form-control" value={form.phoneWork} onChange={(e) => setForm({ ...form, phoneWork: e.target.value })} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-geo-alt me-1"></i>Dirección Casa</label>
                      <input type="text" className="form-control" value={form.addressHome} onChange={(e) => setForm({ ...form, addressHome: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold"><i className="bi bi-briefcase me-1"></i>Dirección Trabajo</label>
                      <input type="text" className="form-control" value={form.addressWork} onChange={(e) => setForm({ ...form, addressWork: e.target.value })} required />
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none' }}>
                      {editingAval ? 'Actualizar' : 'Agregar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}

export default Avales;
