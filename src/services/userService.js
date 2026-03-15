import api from './api';

/**
 * User Service - API calls for user management
 */
const userService = {
  /**
   * Create a new user (FAMILY_ADMIN creates member/viewer, SUPER_ADMIN creates FAMILY_ADMIN)
   * @param {Object} userData - User data including first_name, last_name, email, username, password, role
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  /**
   * Get all users (based on current user's role)
   * - SUPER_ADMIN sees all users
   * - FAMILY_ADMIN sees only users in their tree
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<Array>} List of users
   */
  getUsers: async (skip = 0, limit = 100) => {
    const response = await api.get('/users/', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Get users in the current user's tree (FAMILY_ADMIN only)
   * @returns {Promise<Array>} List of users in the tree
   */
  getTreeUsers: async () => {
    const response = await api.get('/users/me/tree-users');
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} userId - UUID of the user
   * @returns {Promise<Object>} User data
   */
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user
   * @param {string} userId - UUID of the user
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string} userId - UUID of the user
   * @returns {Promise<void>}
   */
  deleteUser: async (userId) => {
    await api.delete(`/users/${userId}`);
  },
};

export default userService;
