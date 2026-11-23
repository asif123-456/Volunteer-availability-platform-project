import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('volunteer_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from token
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem('volunteer_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Session expired or invalid:', error.message);
          localStorage.removeItem('volunteer_token');
          localStorage.removeItem('volunteer_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Standard Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('volunteer_token', res.data.token);
      localStorage.setItem('volunteer_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  // Quick Demo Login (Volunteer, NGO, SuperAdmin)
  const quickLogin = async (role) => {
    let credentials = {};
    if (role === 'volunteer') {
      credentials = { email: 'volunteer@gmail.com', password: 'volunteer123' };
    } else if (role === 'ngo') {
      credentials = { email: 'ngo@greenearth.org', password: 'ngo12345' };
    } else if (role === 'superadmin') {
      credentials = { email: 'admin@volunteer.org', password: 'admin12345' };
    }
    return await login(credentials.email, credentials.password);
  };

  // Register
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      localStorage.setItem('volunteer_token', res.data.token);
      localStorage.setItem('volunteer_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('volunteer_token');
    localStorage.removeItem('volunteer_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        quickLogin,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
