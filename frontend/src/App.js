import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Avales from './components/Avales';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/clients" element={isAuthenticated ? <Layout><Clients /></Layout> : <Navigate to="/login" />} />
        <Route path="/avales" element={isAuthenticated ? <Layout><Avales /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;