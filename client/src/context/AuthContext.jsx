// context/AuthContext.jsx
// Handles login/signup/logout for BOTH user and admin
// Role is detected automatically from backend response

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);

  // Set axios auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  // Fetch logged-in user's profile from backend
  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data.user);
    } catch {
      // Token expired or invalid — clear everything
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // Clear auth state
  const clearAuth = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // ── SIGNUP ──
  // role comes from the radio button on signup form: "user" or "admin"
  const signup = async ({ name, email, password, role }) => {
    const res = await axios.post('/api/auth/signup', { name, email, password, role });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser; // return user so App can redirect based on role
  };

  // ── LOGIN ──
  // No role needed — backend sends back role in response
  const login = async ({ email, password }) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser; // return user so App can redirect based on role
  };

  // ── LOGOUT ──
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout API error:', e.message);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
