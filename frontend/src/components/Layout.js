import React from 'react';
import Navigation from './Navigation';

function Layout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navigation />
      <main className="flex-grow-1">
        {children}
      </main>
    </div>
  );
}

export default Layout;