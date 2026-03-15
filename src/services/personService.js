import api from './api';

/**
 * Person service for CRUD operations
 */
const personService = {
  /**
   * Get all persons with pagination
   * @param {number} skip - Records to skip
   * @param {number} limit - Max records to return
   * @returns {Promise} List of persons
   */
  async getAll(skip = 0, limit = 100) {
    const response = await api.get('/persons/', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Get person by ID
   * @param {string} id - Person UUID
   * @returns {Promise} Person object
   */
  async getById(id) {
    const response = await api.get(`/persons/${id}`);
    return response.data;
  },

  /**
   * Search persons with filters
   * @param {Object} filters - Search filters
   * @returns {Promise} List of matching persons
   */
  async search(filters = {}) {
    const response = await api.get('/persons/search', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Create a new person
   * @param {Object} personData - Person data
   * @returns {Promise} Created person
   */
  async create(personData) {
    const response = await api.post('/persons/', personData);
    return response.data;
  },

  /**
   * Update a person
   * @param {string} id - Person UUID
   * @param {Object} personData - Updated data
   * @returns {Promise} Updated person
   */
  async update(id, personData) {
    const response = await api.put(`/persons/${id}`, personData);
    return response.data;
  },

  /**
   * Delete a person
   * @param {string} id - Person UUID
   * @returns {Promise}
   */
  async delete(id) {
    const response = await api.delete(`/persons/${id}`);
    return response.data;
  },
};

export default personService;
