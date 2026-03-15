import { useState, useCallback } from 'react';
import { treeService } from '../services';

/**
 * Custom hook for family tree traversal operations
 */
export function useFamilyTree() {
  const [ancestors, setAncestors] = useState([]);
  const [descendants, setDescendants] = useState([]);
  const [siblings, setSiblings] = useState([]);
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAncestors = useCallback(async (personId, maxDepth = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await treeService.getAncestors(personId, maxDepth);
      setAncestors(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch ancestors';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDescendants = useCallback(async (personId, maxDepth = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await treeService.getDescendants(personId, maxDepth);
      setDescendants(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch descendants';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSiblings = useCallback(async (personId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await treeService.getSiblings(personId);
      setSiblings(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch siblings';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFamily = useCallback(async (personId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await treeService.getFamily(personId);
      setFamily(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch family';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ancestors,
    descendants,
    siblings,
    family,
    loading,
    error,
    fetchAncestors,
    fetchDescendants,
    fetchSiblings,
    fetchFamily,
  };
}

export default useFamilyTree;
