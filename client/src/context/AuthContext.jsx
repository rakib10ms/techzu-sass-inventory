import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../utils/apiUrl';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend theke cookie read korar jonno axios setup
  axios.defaults.withCredentials = true;

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, credentials);
      if (res.data.success) {
        setUser(res.data.user);
        // Backend jodi cookie set na kore, tobe amader manually user_data rakhte hobe
        // Kintu best practice holo backend theke res.cookie set kora
        return res.data; // Eita must return korte hobe
      }
    } catch (err) {
      throw err; // Eita catch-e gele Login.jsx alert dibe
    }
  };
  const logout = () => {
    Cookies.remove('user_data');
    Cookies.remove('token');
    setUser(null);
  };

  useEffect(() => {
    // Page refresh hole cookie theke user info load hobe
    const savedUser = Cookies.get('user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
