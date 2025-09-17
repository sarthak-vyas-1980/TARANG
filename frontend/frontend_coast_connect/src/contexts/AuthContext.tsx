import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../utils/api';
import { AuthService, NotificationService, StorageService } from '../services';
import type { User, AuthContextType, RegisterData, ApiResponse } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    const token = apiClient.getToken();
    const savedUser = StorageService.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
      // Verify token is still valid
      try {
        const response = await AuthService.getCurrentUser();
        if (response.success && response.data) {
          const updatedUser = response.data.user;
          setUser(updatedUser);
          StorageService.saveUser(updatedUser);
        }
      } catch (error) {
        console.warn('Token validation failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        StorageService.saveUser(user);
        NotificationService.success('Welcome back!', `Logged in as ${user.email}`);
      }
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      NotificationService.error('Login Failed', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        StorageService.saveUser(user);
        NotificationService.success('Welcome!', 'Account created successfully');
      }
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      NotificationService.error('Registration Failed', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setUser(null);
      StorageService.removeUser();
      StorageService.removeToken();
      NotificationService.info('Goodbye!', 'You have been logged out');
    }
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    StorageService.saveUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
