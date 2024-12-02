import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuthStatus: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
	console.log('login', token)
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if there's a valid token in localStorage
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Optional: Verify token with your backend
      // const response = await fetch('/api/verify-token', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // if (!response.ok) throw new Error('Token invalid');

      setIsAuthenticated(true);
    } catch (error) {
	  console.log(error);
      setIsAuthenticated(false);
      localStorage.removeItem('token'); // Clear invalid token
    }
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuthStatus,
    login,
    logout,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };