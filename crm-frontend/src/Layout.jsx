import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/customers', label: 'Customers', icon: '👥', roles: ['ADMIN', 'SALES_REP'] },
    { path: '/analytics', label: 'Analytics', icon: '📊', roles: ['ADMIN', 'ANALYST'] },
    { path: '/admin-dashboard', label: 'Admin', icon: '⚙️', roles: ['ADMIN'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>CRM System</h2>
          <p>{user?.role} Portal</p>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            if (!item.roles.includes(user?.role)) return null;
            
            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="content-header">
          <h1>Welcome back, {user?.name}!</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666' }}>{user?.email}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="content-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;