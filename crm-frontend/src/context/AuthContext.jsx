import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/index.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // بررسی وجود توکن در localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // دریافت اطلاعات کاربر از سرور
      authService.getCurrentUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          // اگر توکن نامعتبر بود، آن را حذف کن
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    // حالت دمو - بدون نیاز به بک‌اند
    const mockUser = {
      id: 1,
      name: 'کاربر تست',
      email: credentials.email,
      role: 'admin'
    };
    const mockToken = 'demo-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
    return { data: { token: mockToken, user: mockUser } };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (data) => {
    // حالت دمو - بدون نیاز به بک‌اند
    const mockUser = {
      id: 1,
      name: data.name,
      email: data.email,
      role: 'admin'
    };
    const mockToken = 'demo-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
    return { data: { token: mockToken, user: mockUser } };
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
