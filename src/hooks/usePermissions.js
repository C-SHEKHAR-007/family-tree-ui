import { useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  isAdmin,
  isSuperAdmin,
  isFamilyAdmin,
  isViewer,
  isMember,
  canWrite,
  canDelete,
  canManageUsers,
  canAccess,
  hasMinimumRole,
  getRoleDisplayName,
  getRoleColor,
} from '../utils/permissions';

/**
 * Hook for checking user permissions based on role
 * Provides convenient access to permission checks in components
 * 
 * @returns {Object} Permission check functions and user role info
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => ({
    // User info
    role: user?.role,
    roleDisplayName: user ? getRoleDisplayName(user.role) : null,
    roleColor: user ? getRoleColor(user.role) : 'gray',

    // Role checks
    isAdmin: isAdmin(user),
    isSuperAdmin: isSuperAdmin(user),
    isFamilyAdmin: isFamilyAdmin(user),
    isViewer: isViewer(user),
    isMember: isMember(user),

    // Permission checks
    canWrite: canWrite(user),
    canDelete: canDelete(user),
    canManageUsers: canManageUsers(user),

    // Feature access
    canAccess: (feature) => canAccess(user, feature),
    hasMinimumRole: (role) => hasMinimumRole(user, role),

    // Specific permissions
    canCreatePerson: canWrite(user),
    canEditPerson: canWrite(user),
    canDeletePerson: canDelete(user),

    canCreateRelationship: canWrite(user),
    canDeleteRelationship: canDelete(user),

    canViewFamilyTree: !!user,
    canViewDashboard: !!user,

    // Admin features
    canAccessAdminPanel: isAdmin(user),
    canCreateUsers: isAdmin(user),
    canDeleteUsers: isSuperAdmin(user),
  }), [user]);

  return permissions;
}

export default usePermissions;
