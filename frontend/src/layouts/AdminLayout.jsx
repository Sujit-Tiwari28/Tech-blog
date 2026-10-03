import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { logout, adminEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-white">Admin Dashboard</p>
            <p className="text-sm text-slate-400">Manage blog posts, categories, and site content.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">{adminEmail}</span>
            <button onClick={handleLogout} className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-slate-950">
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
          <nav className="space-y-3">
            <Link to="/admin/dashboard" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800/80">
              Overview
            </Link>
            <Link to="/admin/posts" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800/80">
              Posts
            </Link>
            <Link to="/admin/posts/new" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800/80">
              New Post
            </Link>
            <Link to="/admin/categories" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800/80">
              Categories
            </Link>
            <Link to="/admin/comments" className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800/80">
              Comments
            </Link>
          </nav>
        </aside>
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
