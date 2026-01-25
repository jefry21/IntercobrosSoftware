import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navigation() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderBottom: '3px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container-fluid">
        {/* Logo/Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <i className="bi bi-building me-2 fs-4"></i>
          Intercobros
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/clients')}`} to="/clients">
                <i className="bi bi-people me-1"></i>
                Clientes
              </Link>
            </li>
            {/* Aquí puedes agregar más enlaces en el futuro */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none p-0"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: 'none', background: 'none' }}
              >
                <i className="bi bi-grid me-1"></i>
                Módulos
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><button className="dropdown-item" onClick={() => alert('Funcionalidad próximamente')}><i className="bi bi-receipt me-1"></i>Facturas</button></li>
                <li><button className="dropdown-item" onClick={() => alert('Funcionalidad próximamente')}><i className="bi bi-graph-up me-1"></i>Reportes</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => alert('Funcionalidad próximamente')}><i className="bi bi-gear me-1"></i>Configuración</button></li>
              </ul>
            </li>
          </ul>

          {/* User Menu */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none d-flex align-items-center p-0"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ border: 'none', background: 'none' }}
              >
                <i className="bi bi-person-circle me-2 fs-5"></i>
                <span>Usuario</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><button className="dropdown-item" onClick={() => alert('Funcionalidad próximamente')}><i className="bi bi-person me-2"></i>Perfil</button></li>
                <li><button className="dropdown-item" onClick={() => alert('Funcionalidad próximamente')}><i className="bi bi-gear me-2"></i>Configuración</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;