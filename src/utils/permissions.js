/**
 * Role-based permission utilities for the Family Tree application
 * 
 * This module provides functions to check user permissions based on their role.
 */

// Define role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY = {
  viewer: 0,
  member: 1,
  admin: 2,
  FAMILY_ADMIN: 3,
  SUPER_ADMIN: 4,
};

// Define admin roles
export const ADMIN_ROLES = ['admin', 'FAMILY_ADMIN', 'SUPER_ADMIN'];

// Define write roles (can create/update)
export const WRITE_ROLES = ['member', 'admin', 'FAMILY_ADMIN', 'SUPER_ADMIN'];

// Define delete roles (can delete resources)
export const DELETE_ROLES = ['admin', 'FAMILY_ADMIN', 'SUPER_ADMIN'];

/**
 * Check if user has admin privileges
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  if (!user?.role) return false;
  return ADMIN_ROLES.includes(user.role);
};

/**
 * Check if user is a super admin
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isSuperAdmin = (user) => {
  return user?.role === 'SUPER_ADMIN';
};

/**
 * Check if user is a family admin
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isFamilyAdmin = (user) => {
  return user?.role === 'FAMILY_ADMIN';
};

/**
 * Check if user is a viewer (read-only)
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isViewer = (user) => {
  return user?.role === 'viewer';
};

/**
 * Check if user is a member
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isMember = (user) => {
  return user?.role === 'member';
};

/**
 * Check if user can perform write operations (create/update)
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canWrite = (user) => {
  if (!user?.role) return false;
  return WRITE_ROLES.includes(user.role);
};

/**
 * Check if user can perform delete operations
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canDelete = (user) => {
  if (!user?.role) return false;
  return DELETE_ROLES.includes(user.role);
};

/**
 * Check if user can manage users (create/delete users)
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canManageUsers = (user) => {
  return isAdmin(user);
};

/**
 * Check if user has at least the specified role level
 * @param {Object} user - User object with role property
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean}
 */
export const hasMinimumRole = (user, requiredRole) => {
  if (!user?.role) return false;
  const userLevel = ROLE_HIERARCHY[user.role] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 999;
  return userLevel >= requiredLevel;
};

/**
 * Check if user can access a specific feature
 * @param {Object} user - User object with role property
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export const canAccess = (user, feature) => {
  if (!user?.role) return false;
  
  const featurePermissions = {
    // Dashboard
    'dashboard': true, // All roles
    'dashboard.stats': true,
    'dashboard.quickActions': canWrite(user),
    
    // Persons
    'persons.list': true,
    'persons.view': true,
    'persons.create': canWrite(user),
    'persons.edit': canWrite(user),
    'persons.delete': canDelete(user),
    
    // Relationships
    'relationships.list': true,
    'relationships.view': true,
    'relationships.create': canWrite(user),
    'relationships.delete': canDelete(user),
    
    // Family Tree
    'familyTree.view': true,
    'familyTree.ancestors': true,
    'familyTree.descendants': true,
    
    // Users (admin only)
    'users.list': isAdmin(user),
    'users.create': isAdmin(user),
    'users.edit': isAdmin(user),
    'users.delete': isSuperAdmin(user),
    
    // Addresses
    'addresses.list': true,
    'addresses.create': canWrite(user),
    'addresses.edit': canWrite(user),
    'addresses.delete': canDelete(user),
    
    // Occupations
    'occupations.list': true,
    'occupations.create': canWrite(user),
    'occupations.edit': canWrite(user),
    'occupations.delete': canDelete(user),
    
    // Settings
    'settings': true,
    'settings.profile': true,
    'settings.admin': isAdmin(user),
  };
  
  return featurePermissions[feature] ?? false;
};

/**
 * Get role display name
 * @param {string} role - Role identifier
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    'SUPER_ADMIN': 'Super Admin',
    'FAMILY_ADMIN': 'Family Admin',
    'admin': 'Admin',
    'member': 'Member',
    'viewer': 'Viewer',
  };
  return displayNames[role] || role;
};

/**
 * Get role color for UI badges
 * @param {string} role - Role identifier
 * @returns {string} - Chakra UI color scheme
 */
export const getRoleColor = (role) => {
  const colors = {
    'SUPER_ADMIN': 'purple',
    'FAMILY_ADMIN': 'blue',
    'admin': 'green',
    'member': 'teal',
    'viewer': 'gray',
  };
  return colors[role] || 'gray';
};

export default {
  ROLE_HIERARCHY,
  ADMIN_ROLES,
  WRITE_ROLES,
  DELETE_ROLES,
  isAdmin,
  isSuperAdmin,
  isFamilyAdmin,
  isViewer,
  isMember,
  canWrite,
  canDelete,
  canManageUsers,
  hasMinimumRole,
  canAccess,
  getRoleDisplayName,
  getRoleColor,
};
