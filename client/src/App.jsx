// App.jsx — Main router
// Single app, role-based routing:
//   /signup        → Signup (with role radio)
//   /login         → Login (auto detects role → redirects)
//   /dashboard     → User Dashboard (role=user only)
//   /admin/dashboard → Admin Dashboard (role=admin only)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Smart home redirect — sends logged-in users to their dashboard
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login"  element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* User dashboard — only role=user */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      }
    />

    {/* Admin dashboard — only role=admin */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />

    {/* Default → smart redirect */}
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
