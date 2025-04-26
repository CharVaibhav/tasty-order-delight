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
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      // If we have a stored user, use it immediately to prevent loading state
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            id: parsedUser.id || parsedUser._id,
            name: parsedUser.name,
            email: parsedUser.email
          });
          setLoading(false);
        } catch (e) {
          console.error('Error parsing stored user:', e);
          // If parsing fails, try to fetch user
          fetchUser(token);
        }
      } else {
        // No stored user, fetch from API
        fetchUser(token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      // Get the API URL from environment variables
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      console.log('Fetching user data from:', `${apiUrl}/api/auth/me`);
      
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Try to fetch user data from API
      try {
        const response = await axios.get(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('User data response:', response.data);
        
        // Transform the response data to match the User interface
        const userData: User = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email
        };
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      } catch (apiError) {
        console.error('Error fetching user data:', apiError);
        
        // Check if we have a stored user as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser({
              id: parsedUser.id || parsedUser._id,
              name: parsedUser.name,
              email: parsedUser.email
            });
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
            // If token is invalid and no stored user, remove token
            if (axios.isAxiosError(apiError) && apiError.response && apiError.response.status === 401) {
              localStorage.removeItem('token');
              setUser(null);
            }
          }
        } else {
          // If token is invalid and no stored user, remove token
          if (axios.isAxiosError(apiError) && apiError.response && apiError.response.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      
      // Check if we have a stored user as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            id: parsedUser.id || parsedUser._id,
            name: parsedUser.name,
            email: parsedUser.email
          });
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
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