# Role Permissions Matrix

This document defines the complete role-based access control (RBAC) permissions for the Family Tree application.

---

## Available Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `SUPER_ADMIN` | Full system access, can manage all users and data | Highest |
| `FAMILY_ADMIN` | Can manage their family tree and administer family members | High |
| `admin` | Standard admin with full access | High |
| `member` | Can manage family tree data (create/edit) | Medium |
| `viewer` | Read-only access to view family data | Low |

---

## Permissions by Role

| Endpoint/Action | SUPER_ADMIN | FAMILY_ADMIN | admin | member | viewer |
|----------------|:-----------:|:------------:|:-----:|:------:|:------:|
| **Authentication** |
| Login | ✓ | ✓ | ✓ | ✓ | ✓ |
| Register | ✓ | ✓ | ✓ | ✓ | ✓ |
| Get Profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Persons** |
| View all persons | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search persons | ✓ | ✓ | ✓ | ✓ | ✓ |
| Get person by ID | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create person | ✓ | ✓ | ✓ | ✓ | ✗ |
| Update person | ✓ | ✓ | ✓ | ✓ | ✗ |
| Delete person | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Relationships** |
| View relationships | ✓ | ✓ | ✓ | ✓ | ✓ |
| Get family tree | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create relationship | ✓ | ✓ | ✓ | ✓ | ✗ |
| Delete relationship | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Family Tree** |
| Get ancestors | ✓ | ✓ | ✓ | ✓ | ✓ |
| Get descendants | ✓ | ✓ | ✓ | ✓ | ✓ |
| Get siblings | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Addresses** |
| View addresses | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create address | ✓ | ✓ | ✓ | ✓ | ✗ |
| Update address | ✓ | ✓ | ✓ | ✓ | ✗ |
| Delete address | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Occupations** |
| View occupations | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create occupation | ✓ | ✓ | ✓ | ✓ | ✗ |
| Update occupation | ✓ | ✓ | ✓ | ✓ | ✗ |
| Delete occupation | ✓ | ✓ | ✓ | ✗ | ✗ |
| **Users** |
| Create user | ✓ | ✓ | ✓ | ✗ | ✗ |

---

## Summary by Access Type

| Permission Type | Roles Allowed |
|-----------------|---------------|
| **Admin Operations** (delete, create users) | `SUPER_ADMIN`, `FAMILY_ADMIN`, `admin` |
| **Write Operations** (create, update) | `SUPER_ADMIN`, `FAMILY_ADMIN`, `admin`, `member` |
| **Read Operations** (view, search) | All roles |

---

## HTTP Status Codes

| Scenario | Status Code |
|----------|-------------|
| Success | 200 / 201 / 204 |
| Unauthorized (no token) | 401 |
| Forbidden (insufficient role) | 403 |
| Not Found | 404 |

---

## UI Behavior by Role

### Viewer Role
- **Navbar**: No "Add" buttons visible
- **Dashboard**: 
  - Quick Actions show disabled buttons with lock icon
  - "View-only mode" badge displayed
  - No "Add Your First Family Member" button when list is empty
- **Persons List**:
  - "Read-only" badge next to count
  - No "Add Person" button
  - Menu only shows "View" option (no Edit/Delete)
- **Relationships**: Cannot add new relationships
- **Profile**: Can view and edit own profile

### Member Role
- **Full Access to**:
  - View all data
  - Add persons
  - Edit persons
  - Add relationships
- **Restricted from**:
  - Delete operations
  - User management
  - Admin panel

### Admin Roles (admin, FAMILY_ADMIN, SUPER_ADMIN)
- **Full Access to**:
  - All CRUD operations
  - Delete any person/relationship
  - Admin panel access
  - User management

---

## Frontend Implementation

### Utils: `src/utils/permissions.js`

```javascript
import { canWrite, canDelete, isAdmin, getRoleDisplayName, getRoleColor } from '../utils/permissions';

// Check permissions
if (canWrite(user)) { /* show add button */ }
if (canDelete(user)) { /* show delete button */ }
if (isAdmin(user)) { /* show admin panel */ }

// Get role info
const color = getRoleColor(user.role);       // 'purple', 'blue', 'green', etc.
const name = getRoleDisplayName(user.role);  // 'Super Admin', 'Member', etc.
```

### Hook: `src/hooks/usePermissions.js`

```javascript
import { usePermissions } from '../hooks';

function MyComponent() {
  const { 
    canWrite, 
    canDelete, 
    isAdmin, 
    isViewer,
    roleDisplayName,
    roleColor 
  } = usePermissions();

  return (
    <>
      {canWrite && <Button>Add Person</Button>}
      {canDelete && <Button colorScheme="red">Delete</Button>}
      <Badge colorScheme={roleColor}>{roleDisplayName}</Badge>
    </>
  );
}
```

### Auth Hook: `src/hooks/useAuth.jsx`

```javascript
const { 
  user, 
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  isFamilyAdmin,
  isViewer,
  isMember,
  canWrite,
  canDelete 
} = useAuth();
```

---

## Role Hierarchy

```
SUPER_ADMIN (highest)
    ↓
FAMILY_ADMIN
    ↓
admin
    ↓
member
    ↓
viewer (lowest - read-only)
```

---

## Role Badge Colors

| Role | Chakra Color Scheme |
|------|---------------------|
| `SUPER_ADMIN` | purple |
| `FAMILY_ADMIN` | blue |
| `admin` | green |
| `member` | teal |
| `viewer` | gray |
