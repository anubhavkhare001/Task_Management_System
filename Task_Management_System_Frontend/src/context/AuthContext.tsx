import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  createdOn: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore auth state on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('user');
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (storedUser && username && password) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);

      // Set axios auth headers for future requests
      axios.defaults.auth = {
        username,
        password,
      };
    } else {
      setUser(null);
      setIsAuthenticated(false);
      delete axios.defaults.auth;
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', { username, password });

      if (response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        // Set axios auth headers dynamically on login
        axios.defaults.auth = {
          username,
          password,
        };
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.data && response.data.username) {
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    // Clear axios auth on logout
    delete axios.defaults.auth;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        error,
        loading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
