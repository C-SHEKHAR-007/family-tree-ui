import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and provides auth context
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      await authService.login(email, password);
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Register user
   */
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const profile = await authService.register(userData);
      return profile;
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Profile refresh failed:', err);
      throw err;
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    // Role checks
    isAdmin: user && ['admin', 'FAMILY_ADMIN', 'SUPER_ADMIN'].includes(user.role),
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isFamilyAdmin: user?.role === 'FAMILY_ADMIN',
    isViewer: user?.role === 'viewer',
    isMember: user?.role === 'member',
    // Permission checks
    canWrite: user && user.role !== 'viewer',
    canDelete: user && ['admin', 'FAMILY_ADMIN', 'SUPER_ADMIN'].includes(user.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
