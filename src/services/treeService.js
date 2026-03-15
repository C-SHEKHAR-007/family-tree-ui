import api from './api';

/**
 * Family Tree service for tree traversal operations
 */
const treeService = {
  /**
   * Get ancestors of a person
   * @param {string} personId - Person UUID
   * @param {number} maxDepth - Maximum generations to traverse
   * @returns {Promise} List of ancestors
   */
  async getAncestors(personId, maxDepth = 5) {
    const response = await api.get(`/tree/${personId}/ancestors`, {
      params: { max_depth: maxDepth },
    });
    return response.data;
  },

  /**
   * Get descendants of a person
   * @param {string} personId - Person UUID
   * @param {number} maxDepth - Maximum generations to traverse
   * @returns {Promise} List of descendants
   */
  async getDescendants(personId, maxDepth = 5) {
    const response = await api.get(`/tree/${personId}/descendants`, {
      params: { max_depth: maxDepth },
    });
    return response.data;
  },

  /**
   * Get siblings of a person
   * @param {string} personId - Person UUID
   * @returns {Promise} List of siblings
   */
  async getSiblings(personId) {
    const response = await api.get(`/tree/${personId}/siblings`);
    return response.data;
  },

  /**
   * Get complete family data for a person
   * @param {string} personId - Person UUID
   * @returns {Promise} Complete family data
   */
  async getFamily(personId) {
    const response = await api.get(`/tree/${personId}/family`);
    return response.data;
  },
};

export default treeService;
