import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('driveeasy_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('driveeasy_token') || null;
  });

  const login = (customerData, authToken) => {
    setCustomer(customerData);
    setToken(authToken);
    localStorage.setItem('driveeasy_customer', JSON.stringify(customerData));
    localStorage.setItem('driveeasy_token', authToken);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('driveeasy_customer');
    localStorage.removeItem('driveeasy_token');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ customer, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
