import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../utils/api';
import { API_URL } from '../utils/apiUrl';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // পেজ রিফ্রেশ হলে cookie থেকে user load করবে
  useEffect(() => {
    const savedUser = Cookies.get('user_data');
    const token = Cookies.get('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await axios.post(`${API_URL}/api/users/login`, credentials);
    const { user, token } = res.data;
    console.log('user data', user);

    if (!token) throw new Error('No token received from server');

    // Cookie তে save করো
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user_data', JSON.stringify(user), { expires: 7 });

    // API header set করো
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Context state update করো
    setUser(user);

    return res.data;
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user_data');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
