import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      // Get the API URL from environment variables
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('API URL for user fetch:', apiUrl);
      
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('User data:', response.data);
      
      // Transform the response data to match the User interface
      const userData: User = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email
      };
      
      setUser(userData);
    } catch (error) {
      console.warn('Failed to fetch user data:', error);
      // Don't remove token on network errors to prevent unnecessary logouts
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 