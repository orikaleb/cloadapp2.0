'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: { email: string; name?: string; id?: string; phone?: string; address?: string } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id?: string; email: string; name?: string; phone?: string; address?: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('userAuth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          setIsAuthenticated(true);
          setUser(parsed);
        } catch (error) {
          console.error('Failed to parse auth data:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store user data
      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
      };
      
      localStorage.setItem('userAuth', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userAuth');
    // Clear cart on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('pendingCartItems');
    }
  };

  const checkAuth = (): boolean => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('userAuth');
      return !!authData;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

