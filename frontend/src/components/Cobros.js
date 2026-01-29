import React, { useState, useEffect } from 'react';

function Cobros() {
  const [cobros, setCobros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    // Datos mock realistas
    const mockCobros = [];
    const nombres = ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Roberto', 'Diana'];
    const apellidos = ['Martínez', 'López', 'García', 'Hernández', 'Rodríguez', 'Flores', 'Díaz'];
    const empresas = ['Banco Atlantida', 'BAC Honduras', 'Banco Ficohsa', 'Banco Occidente', 'Banpais', 'Banco Lafise'];
    const descriptivos = ['Préstamo Personal', 'Tarjeta de Crédito', 'Préstamo Vehicular', 'Crédito Hipotecario'];
    
    for (let i = 1; i <= 30; i++) {
      const saldoInicial = Math.floor(Math.random() * 50000) + 10000;
      const pagosRealizados = Math.floor(Math.random() * 12);
      const saldoActual = saldoInicial - (pagosRealizados * (saldoInicial / 24));
      const honorario = saldoActual * 0.15;
      
      mockCobros.push({
        id: i,
        nombreCliente: `${nombres[i % nombres.length]} ${apellidos[i % apellidos.length]}`,
        dni: `${String(Math.floor(300000000 + i * 123456)).substring(0, 13)}`,
        descriptivo1: descriptivos[i % descriptivos.length],
        descriptivo2: pagosRealizados > 6 ? 'Al día' : 'Atrasado',
        empresa: empresas[i % empresas.length],
        fechaAsignacion: new Date(2024, Math.floor(i / 3) % 12, (i * 5) % 28 + 1).toLocaleDateString('es-HN'),
        numeroAfiliado: `AF-${String(10000 + i).padStart(6, '0')}`,
        numeroPrestamo: `PR-${String(20000 + i * 3).padStart(8, '0')}`,
        saldoInicial: saldoInicial.toFixed(2),
        pagosRealizados: pagosRealizados,
        saldoActual: saldoActual.toFixed(2),
        saldoConHonorario: (saldoActual + honorario).toFixed(2),
        fechaProximoPago: new Date(2026, 1, (i * 7) % 28 + 1).toLocaleDateString('es-HN')
      });
    }
    setCobros(mockCobros);
  }, []);

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
            <h3 className="mb-0 fw-bold">{cobros.length}</h3>
            <small className="opacity-75">Cobros registrados</small>
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
                  <th className="border-0 py-3 px-3 text-end" style={{ minWidth: '120px' }}>Saldo Actual</th>
                  <th className="border-0 py-3 px-3 text-end" style={{ minWidth: '140px' }}>Con Honorario</th>
                  <th className="border-0 py-3 px-3 text-center" style={{ minWidth: '100px' }}>Pagos</th>
                  <th className="border-0 py-3 px-3 text-center" style={{ minWidth: '80px' }}>Detalles</th>
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
                      <td className="px-3 py-3 text-end">
                        <span className="fw-semibold text-primary">{formatCurrency(cobro.saldoActual)}</span>
                      </td>
                      <td className="px-3 py-3 text-end">
                        <span className="fw-bold text-success">{formatCurrency(cobro.saldoConHonorario)}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="badge bg-info">{cobro.pagosRealizados}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <i className={`bi bi-chevron-${expandedRow === cobro.id ? 'up' : 'down'} text-muted`}></i>
                      </td>
                    </tr>
                    {expandedRow === cobro.id && (
                      <tr style={{ backgroundColor: '#e8f5e9' }}>
                        <td colSpan="8" className="px-4 py-3">
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
    </div>
  );
}

export default Cobros;
