import { useState, useCallback } from 'react';
import { relationshipService } from '../services';

/**
 * Custom hook for relationship operations
 */
export function useRelationships() {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRelationships = useCallback(async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await relationshipService.getAll(skip, limit);
      setRelationships(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch relationships';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPersonRelationships = useCallback(async (personId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await relationshipService.getByPerson(personId);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch relationships';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRelationship = useCallback(async (relationshipData) => {
    try {
      setLoading(true);
      setError(null);
      const newRelationship = await relationshipService.create(relationshipData);
      setRelationships((prev) => [...prev, newRelationship]);
      return newRelationship;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create relationship';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRelationship = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await relationshipService.delete(id);
      setRelationships((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete relationship';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    relationships,
    loading,
    error,
    fetchRelationships,
    getPersonRelationships,
    createRelationship,
    deleteRelationship,
  };
}

export default useRelationships;
