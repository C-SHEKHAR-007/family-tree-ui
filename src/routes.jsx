import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { PersonsList, PersonCreate, PersonEdit, PersonView } from './pages/Persons';
import FamilyTree from './pages/FamilyTree';
import Relationships from './pages/Relationships';
import Profile from './pages/Profile';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/persons',
    element: (
      <ProtectedRoute>
        <Layout>
          <PersonsList />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/persons/new',
    element: (
      <ProtectedRoute>
        <Layout>
          <PersonCreate />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/persons/:id',
    element: (
      <ProtectedRoute>
        <Layout>
          <PersonView />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/persons/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout>
          <PersonEdit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/family-tree',
    element: (
      <ProtectedRoute>
        <Layout>
          <FamilyTree />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/relationships',
    element: (
      <ProtectedRoute>
        <Layout>
          <Relationships />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
