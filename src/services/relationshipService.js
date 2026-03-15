import api from './api';

/**
 * Relationship service for managing family relationships
 */
const relationshipService = {
  /**
   * Get all relationships with pagination
   * @param {number} skip - Records to skip
   * @param {number} limit - Max records to return
   * @returns {Promise} List of relationships
   */
  async getAll(skip = 0, limit = 100) {
    const response = await api.get('/relationships/', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Get relationship by ID
   * @param {string} id - Relationship UUID
   * @returns {Promise} Relationship object
   */
  async getById(id) {
    const response = await api.get(`/relationships/${id}`);
    return response.data;
  },

  /**
   * Get relationships for a person
   * @param {string} personId - Person UUID
   * @returns {Promise} Person's relationships
   */
  async getByPerson(personId) {
    const response = await api.get(`/relationships/person/${personId}`);
    return response.data;
  },

  /**
   * Create a new relationship
   * @param {Object} relationshipData - Relationship data
   * @returns {Promise} Created relationship
   */
  async create(relationshipData) {
    const response = await api.post('/relationships/', relationshipData);
    return response.data;
  },

  /**
   * Delete a relationship
   * @param {string} id - Relationship UUID
   * @returns {Promise}
   */
  async delete(id) {
    const response = await api.delete(`/relationships/${id}`);
    return response.data;
  },
};

export default relationshipService;
