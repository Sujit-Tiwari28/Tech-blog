import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminPostsPage from './pages/AdminPostsPage.jsx';
import AdminPostEditorPage from './pages/AdminPostEditorPage.jsx';
import AdminCommentsPage from './pages/AdminCommentsPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PostDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="posts" element={<AdminPostsPage />} />
        <Route path="posts/new" element={<AdminPostEditorPage />} />
        <Route path="posts/:id/edit" element={<AdminPostEditorPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log('📍 Route changed:', location.pathname, location.search);
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <>
      <RouteLogger />
      <AppRoutes />
    </>
  );
}

export default App;
