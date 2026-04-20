import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from local storage on app start
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, role = 'patient') => {
    try {
      let endpoint = '/auth/login/patient';
      if (role === 'vendor') endpoint = '/auth/login/vendor';
      if (role === 'doctor') endpoint = '/auth/login/doctor';
      
      const { data } = await API.post(endpoint, { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Cart persistence is currently handled fully by client-side localStorage.
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    // Clear cart data from localStorage for the current user
    if (user?.id) {
      localStorage.removeItem(`medCart_${user.id}`);
    }

    // Also clear any other cart-related data with pattern medCart_*
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('medCart_')) {
        localStorage.removeItem(key);
      }
    });

    // Remove JWT token and user info
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};