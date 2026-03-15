import { useState, useCallback } from 'react';
import userService from '../services/userService';

/**
 * Custom hook for user management
 */
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch users based on current user's role
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch users';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch users in the current user's tree
   */
  const fetchTreeUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getTreeUsers();
      setUsers(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch tree users';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new user
   * @param {Object} userData - User data
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a user
   * @param {string} userId - User ID
   */
  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchTreeUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
