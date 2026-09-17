import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on boot
    const storedUser = localStorage.getItem('fincore_user');
    const storedToken = localStorage.getItem('fincore_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('fincore_user');
        localStorage.removeItem('fincore_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await apiClient.login(username, password);
    const { token, user: loggedUser } = res.data;
    localStorage.setItem('fincore_token', token);
    localStorage.setItem('fincore_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem('fincore_token');
    localStorage.removeItem('fincore_user');
    setUser(null);
  };

  // Role check helpers
  const isAdmin = user?.role === 'ADMIN';
  const isSupervisor = user?.role === 'SUPERVISOR';
  const isTeller = user?.role === 'TELLER';
  const isAuditor = user?.role === 'AUDITOR';
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isSupervisor,
        isTeller,
        isAuditor,
        isCustomer,
      }}
    >
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
