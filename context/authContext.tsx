import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (error) {
          console.error('Error getting current user:', error);
        }
        setUser(user || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // Listen for storage changes
    const checkAuthState = async () => {
      try {
        const userString = await AsyncStorage.getItem('firebase_user');
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
          console.log('Auth state changed: User logged in');
        } else {
          setUser(null);
          console.log('Auth state changed: User logged out');
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
      }
    };

    // Check auth state periodically
    const interval = setInterval(checkAuthState, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
