import React, { useState, useEffect } from 'react';
import { clientsService, pagosService } from '../services/authService';

function Cobros() {
  const [cobros, setCobros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [selectedCobro, setSelectedCobro] = useState(null);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [formPago, setFormPago] = useState({
    monto: '',
    metodoPago: 'Efectivo',
    referencia: '',
    notas: ''
  });
  const [editandoFecha, setEditandoFecha] = useState(null);
  const itemsPerPage = 10;

  // Función para generar números pseudo-aleatorios basados en una semilla (igual que backend)
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  useEffect(() => {
    const loadCobros = async () => {
      setLoading(true);
      try {
        // Cargar todos los clientes del backend
        const clientResponse = await clientsService.getClients(1, 100);
        const allClients = clientResponse.clients;

        // Generar cobros basados en los clientes reales
        const mockCobros = allClients.map((cliente) => {
          const saldoInicial = Math.floor(seededRandom(cliente.id * 1.5) * 50000) + 10000;
          const pagosRealizados = Math.floor(seededRandom(cliente.id * 2.3) * 12);
          const saldoActual = saldoInicial - (pagosRealizados * (saldoInicial / 24));
          const honorario = saldoActual * 0.15;
          
          const empresas = ['Banco Atlantida', 'BAC Honduras', 'Banco Ficohsa', 'Banco Occidente', 'Banpais', 'Banco Lafise'];
          const descriptivos = ['Préstamo Personal', 'Tarjeta de Crédito', 'Préstamo Vehicular', 'Crédito Hipotecario'];
          
          // Generar fecha de gestión (algunas en el pasado, algunas futuras)
          const diasAleatorios = Math.floor(Math.random() * 20) - 10; // -10 a +10 días
          const fechaGestion = new Date();
          fechaGestion.setDate(fechaGestion.getDate() + diasAleatorios);
          
          return {
            id: cliente.id,
            nombreCliente: cliente.name,
            dni: cliente.dni,
            descriptivo1: descriptivos[cliente.id % descriptivos.length],
            descriptivo2: pagosRealizados > 6 ? 'Al día' : 'Atrasado',
            empresa: empresas[cliente.id % empresas.length],
            fechaAsignacion: new Date(2024, Math.floor(cliente.id / 3) % 12, (cliente.id * 5) % 28 + 1).toLocaleDateString('es-HN'),
            numeroAfiliado: `AF-${String(10000 + cliente.id).padStart(6, '0')}`,
            numeroPrestamo: `PR-${String(20000 + cliente.id * 3).padStart(8, '0')}`,
            saldoInicial: saldoInicial.toFixed(2),
            pagosRealizados: pagosRealizados,
            saldoActual: saldoActual.toFixed(2),
            saldoConHonorario: (saldoActual + honorario).toFixed(2),
            fechaProximoPago: new Date(2026, 1, (cliente.id * 7) % 28 + 1).toLocaleDateString('es-HN'),
            fechaGestion: fechaGestion.toISOString().split('T')[0] // Formato YYYY-MM-DD
          };
        });
        setCobros(mockCobros);
      } catch (err) {
        console.error('Error cargando cobros:', err);
        alert('Error cargando cobros');
      } finally {
        setLoading(false);
      }
    };

    loadCobros();
  }, []);

  const handleOpenPago = (cobro) => {
    setSelectedCobro(cobro);
    setFormPago({ monto: '', metodoPago: 'Efectivo', referencia: '', notas: '' });
    setShowPagoModal(true);
  };

  const handleRegistrarPago = async () => {
    if (!formPago.monto || parseFloat(formPago.monto) <= 0) {
      alert('Ingrese un monto válido');
      return;
    }

    try {
      await pagosService.createPago({
        clienteId: selectedCobro.id,
        monto: parseFloat(formPago.monto),
        metodoPago: formPago.metodoPago,
        referencia: formPago.referencia,
        notas: formPago.notas
      });

      // Actualizar saldo actual
      const saldoActual = parseFloat(selectedCobro.saldoActual);
      const nuevoSaldo = saldoActual - parseFloat(formPago.monto);
      const honorario = nuevoSaldo * 0.15;

      const cobrosActualizados = cobros.map(c => 
        c.id === selectedCobro.id 
          ? { 
              ...c, 
              saldoActual: nuevoSaldo.toFixed(2), 
              saldoConHonorario: (nuevoSaldo + honorario).toFixed(2),
              pagosRealizados: c.pagosRealizados + 1
            }
          : c
      );
      setCobros(cobrosActualizados);
      
      setShowPagoModal(false);
      alert('Pago registrado exitosamente');
    } catch (err) {
      console.error('Error registrando pago:', err);
      alert('Error al registrar el pago');
    }
  };

  const handleVerHistorial = async (cobro) => {
    setSelectedCobro(cobro);
    try {
      const data = await pagosService.getPagos(cobro.id);
      setHistorialPagos(data.pagos);
      setShowHistorialModal(true);
    } catch (err) {
      console.error('Error cargando historial:', err);
      alert('Error al cargar el historial de pagos');
    }
  };

  const handleActualizarTareas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    let actualizadas = 0;
    
    const cobrosActualizados = cobros.map(cobro => {
      if (cobro.fechaGestion < hoy) {
        actualizadas++;
        return { ...cobro, fechaGestion: hoy };
      }
      return cobro;
    });
    
    setCobros(cobrosActualizados);
    alert(`Se actualizaron ${actualizadas} tareas a la fecha de hoy`);
  };

  const handleCambiarFechaGestion = (cobroId, nuevaFecha) => {
    const cobrosActualizados = cobros.map(cobro => 
      cobro.id === cobroId ? { ...cobro, fechaGestion: nuevaFecha } : cobro
    );
    setCobros(cobrosActualizados);
    setEditandoFecha(null);
  };

  const filteredCobros = cobros.filter(cobro => 
    cobro.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cobro.dni.includes(searchTerm) ||
    cobro.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cobro.numeroPrestamo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCobros.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCobros = filteredCobros.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value) => {
    return `L ${parseFloat(value).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header con gradiente verde */}
      <div className="mb-4 p-4 rounded shadow-sm" style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white'
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2 className="mb-1 fw-bold">
              <i className="bi bi-cash-coin me-2"></i>
              Sistema de Cobros
            </h2>
            <p className="mb-0 opacity-75">Gestión integral de cobros y pagos</p>
          </div>
          <div className="text-end">
            <button 
              className="btn btn-light btn-sm mb-2"
              onClick={handleActualizarTareas}
              title="Actualiza las tareas con fecha anterior a hoy"
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Actualizar Tareas
            </button>
            <div>
              <h3 className="mb-0 fw-bold">{cobros.length}</h3>
              <small className="opacity-75">Cobros registrados</small>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por cliente, DNI, empresa o número de préstamo..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <div className="col-md-6 text-end mt-2 mt-md-0">
              <small className="text-muted">
                Mostrando {paginatedCobros.length} de {filteredCobros.length} cobros
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <tr>
                  <th className="border-0 py-3 px-3" style={{ minWidth: '180px' }}>Cliente</th>
                  <th className="border-0 py-3 px-3" style={{ minWidth: '120px' }}>DNI</th>
                  <th className="border-0 py-3 px-3" style={{ minWidth: '150px' }}>Tipo</th>
                  <th className="border-0 py-3 px-3" style={{ minWidth: '150px' }}>Empresa</th>
                  <th className="border-0 py-3 px-3 text-center" style={{ minWidth: '150px' }}>Fecha Gestión</th>
                  <th className="border-0 py-3 px-3 text-end" style={{ minWidth: '120px' }}>Saldo Actual</th>
                  <th className="border-0 py-3 px-3 text-end" style={{ minWidth: '140px' }}>Con Honorario</th>
                  <th className="border-0 py-3 px-3 text-center" style={{ minWidth: '100px' }}>Pagos</th>
                  <th className="border-0 py-3 px-3 text-center" style={{ minWidth: '200px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCobros.map((cobro, index) => (
                  <React.Fragment key={cobro.id}>
                    <tr style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleRow(cobro.id)}>
                      <td className="px-3 py-3">
                        <div className="fw-semibold text-dark">{cobro.nombreCliente}</div>
                        <small className="text-muted">Número de préstamo: {cobro.numeroPrestamo}</small>
                      </td>
                      <td className="px-3 py-3">
                        <small className="text-muted">{cobro.dni}</small>
                      </td>
                      <td className="px-3 py-3">
                        <div>{cobro.descriptivo1}</div>
                        <small className={`badge ${cobro.descriptivo2 === 'Al día' ? 'bg-success' : 'bg-warning'}`}>
                          {cobro.descriptivo2}
                        </small>
                      </td>
                      <td className="px-3 py-3">
                        <small>{cobro.empresa}</small>
                      </td>
                      <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {editandoFecha === cobro.id ? (
                          <div className="d-flex align-items-center justify-content-center">
                            <input 
                              type="date" 
                              className="form-control form-control-sm" 
                              style={{ width: '140px' }}
                              defaultValue={cobro.fechaGestion}
                              onBlur={(e) => handleCambiarFechaGestion(cobro.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCambiarFechaGestion(cobro.id, e.target.value);
                                } else if (e.key === 'Escape') {
                                  setEditandoFecha(null);
                                }
                              }}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div 
                            onClick={() => setEditandoFecha(cobro.id)}
                            style={{ cursor: 'pointer' }}
                            title="Clic para editar"
                          >
                            {(() => {
                              const hoy = new Date().toISOString().split('T')[0];
                              const esPasado = cobro.fechaGestion < hoy;
                              const esHoy = cobro.fechaGestion === hoy;
                              return (
                                <>
                                  <div className={`fw-semibold ${esPasado ? 'text-danger' : esHoy ? 'text-warning' : 'text-success'}`}>
                                    {new Date(cobro.fechaGestion + 'T00:00:00').toLocaleDateString('es-HN')}
                                  </div>
                                  <small className="text-muted">
                                    <i className="bi bi-pencil-square"></i> Editar
                                  </small>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-end">
                        <span className="fw-semibold text-primary">{formatCurrency(cobro.saldoActual)}</span>
                      </td>
                      <td className="px-3 py-3 text-end">
                        <span className="fw-bold text-success">{formatCurrency(cobro.saldoConHonorario)}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="badge bg-info">{cobro.pagosRealizados}</span>
                      </td>
                      <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleOpenPago(cobro)}
                          title="Registrar Pago"
                        >
                          <i className="bi bi-cash-stack me-1"></i>Pago
                        </button>
                        <button 
                          className="btn btn-sm btn-info"
                          onClick={() => handleVerHistorial(cobro)}
                          title="Ver Historial"
                        >
                          <i className="bi bi-clock-history me-1"></i>Historial
                        </button>
                      </td>
                    </tr>
                    {expandedRow === cobro.id && (
                      <tr style={{ backgroundColor: '#e8f5e9' }}>
                        <td colSpan="9" className="px-4 py-3">
                          <div className="row g-3">
                            <div className="col-md-3">
                              <small className="text-muted d-block">Número de Afiliado</small>
                              <strong>{cobro.numeroAfiliado}</strong>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">Fecha de Asignación</small>
                              <strong>{cobro.fechaAsignacion}</strong>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">Saldo Inicial</small>
                              <strong className="text-info">{formatCurrency(cobro.saldoInicial)}</strong>
                            </div>
                            <div className="col-md-3">
                              <small className="text-muted d-block">Próximo Pago</small>
                              <strong className="text-danger">{cobro.fechaProximoPago}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedCobros.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-2">No se encontraron cobros</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <i className="bi bi-chevron-left me-1"></i>Anterior
              </button>
              <span className="text-muted">
                Página {page} de {totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Siguiente<i className="bi bi-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Registrar Pago */}
      {showPagoModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                <h5 className="modal-title">Registrar Pago</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPagoModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedCobro && (
                  <>
                    <div className="mb-3">
                      <strong>Cliente:</strong> {selectedCobro.nombreCliente}
                    </div>
                    <div className="mb-3">
                      <strong>Saldo Actual:</strong> {formatCurrency(selectedCobro.saldoActual)}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Monto a Pagar *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={formPago.monto}
                        onChange={(e) => setFormPago({...formPago, monto: e.target.value})}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Método de Pago</label>
                      <select 
                        className="form-select"
                        value={formPago.metodoPago}
                        onChange={(e) => setFormPago({...formPago, metodoPago: e.target.value})}
                      >
                        <option>Efectivo</option>
                        <option>Transferencia</option>
                        <option>Tarjeta</option>
                        <option>Cheque</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Referencia/Número de Transacción</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formPago.referencia}
                        onChange={(e) => setFormPago({...formPago, referencia: e.target.value})}
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notas</label>
                      <textarea 
                        className="form-control" 
                        rows="2"
                        value={formPago.notas}
                        onChange={(e) => setFormPago({...formPago, notas: e.target.value})}
                        placeholder="Opcional"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPagoModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={handleRegistrarPago}>
                  <i className="bi bi-check-circle me-1"></i>Registrar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Pagos */}
      {showHistorialModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                <h5 className="modal-title">Historial de Pagos</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowHistorialModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedCobro && (
                  <>
                    <div className="mb-3">
                      <strong>Cliente:</strong> {selectedCobro.nombreCliente}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Método</th>
                            <th>Referencia</th>
                            <th>Notas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historialPagos.length > 0 ? (
                            historialPagos.map((pago) => (
                              <tr key={pago.id}>
                                <td>{new Date(pago.fecha).toLocaleDateString('es-HN')}</td>
                                <td className="fw-bold text-success">{formatCurrency(pago.monto)}</td>
                                <td>{pago.metodoPago}</td>
                                <td>{pago.referencia || '-'}</td>
                                <td>{pago.notas || '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">No hay pagos registrados</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowHistorialModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cobros;
