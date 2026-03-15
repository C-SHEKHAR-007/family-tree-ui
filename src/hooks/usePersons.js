import { useState, useCallback } from 'react';
import { personService } from '../services';

/**
 * Custom hook for person operations
 */
export function usePersons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPersons = useCallback(async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await personService.getAll(skip, limit);
      setPersons(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch persons';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPersons = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await personService.search(filters);
      setPersons(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Search failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPerson = useCallback(async (personData) => {
    try {
      setLoading(true);
      setError(null);
      const newPerson = await personService.create(personData);
      setPersons((prev) => [...prev, newPerson]);
      return newPerson;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create person';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePerson = useCallback(async (id, personData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPerson = await personService.update(id, personData);
      setPersons((prev) =>
        prev.map((p) => (p.id === id ? updatedPerson : p))
      );
      return updatedPerson;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update person';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePerson = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await personService.delete(id);
      setPersons((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete person';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    persons,
    loading,
    error,
    fetchPersons,
    searchPersons,
    createPerson,
    updatePerson,
    deletePerson,
  };
}

export default usePersons;
