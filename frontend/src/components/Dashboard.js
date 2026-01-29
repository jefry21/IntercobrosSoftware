import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="jumbotron bg-light p-5 rounded shadow" style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: 'none'
            }}>
              <h1 className="display-4 text-primary fw-bold">Bienvenido a Intercobros</h1>
              <p className="lead text-muted">Sistema integral de gestión de cobros</p>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-award-fill me-2" style={{ color: '#667eea' }}></i>
                Creado por <span className="fw-semibold" style={{ color: '#667eea' }}>EcoSphere</span>
              </p>
              <hr className="my-4" style={{ borderColor: '#667eea', opacity: 0.3 }} />
              <p className="mb-4">Administra clientes, registra cobros y genera reportes de manera eficiente.</p>
              <div className="row mt-4">
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow-sm border-0 h-100" style={{
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => navigate('/clients')}>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3">
                        <i className="bi bi-people-fill text-primary fs-1"></i>
                      </div>
                      <h5 className="card-title text-primary">Gestión de Clientes</h5>
                      <p className="card-text text-muted flex-grow-1">Administra la información de tus clientes de forma organizada.</p>
                      <button className="btn btn-primary mt-auto" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}>
                        <i className="bi bi-arrow-right-circle me-1"></i>Acceder
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow-sm border-0 h-100" style={{
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => navigate('/avales')}>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3">
                        <i className="bi bi-person-badge-fill fs-1" style={{ color: '#f5576c' }}></i>
                      </div>
                      <h5 className="card-title" style={{ color: '#f5576c' }}>Gestión de Avales</h5>
                      <p className="card-text text-muted flex-grow-1">Administra la información de los avales asociados a tus clientes.</p>
                      <button className="btn mt-auto" style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        border: 'none',
                        color: 'white'
                      }}>
                        <i className="bi bi-arrow-right-circle me-1"></i>Acceder
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow-sm border-0 h-100" style={{
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => navigate('/cobros')}>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3">
                        <i className="bi bi-cash-coin text-success fs-1"></i>
                      </div>
                      <h5 className="card-title text-success">Sistema de Cobros</h5>
                      <p className="card-text text-muted flex-grow-1">Registra y administra todos tus cobros pendientes.</p>
                      <button className="btn mt-auto" style={{
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        border: 'none',
                        color: 'white'
                      }}>
                        <i className="bi bi-arrow-right-circle me-1"></i>Acceder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card text-center shadow-sm border-0 h-100" style={{
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3">
                        <i className="bi bi-graph-up text-info fs-1"></i>
                      </div>
                      <h5 className="card-title text-info">Reportes y Analytics</h5>
                      <p className="card-text text-muted flex-grow-1">Genera reportes detallados y análisis de rendimiento.</p>
                      <button className="btn btn-info mt-auto" disabled style={{ opacity: 0.6 }}>
                        <i className="bi bi-tools me-1"></i>Próximamente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;