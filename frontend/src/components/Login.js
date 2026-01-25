import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ username, password });
      login(data.token);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-gradient-primary text-white text-center py-4">
                <h3 className="mb-0 font-weight-bold">Bienvenido a Intercobros</h3>
                <p className="mb-0">Inicia sesión para continuar</p>
              </div>
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-bold">Usuario</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Ingresa tu usuario"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Cargando...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <small className="text-muted">¿Olvidaste tu contraseña? <a href="#" className="text-primary">Recupérala aquí</a></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;