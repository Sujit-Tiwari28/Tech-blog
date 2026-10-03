import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  usePageMetadata({ title: 'Admin login', description: 'Secure admin login for the TechBlog dashboard.' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('📝 Login form submitted');

    // Validate inputs
    if (!email || !password) {
      const message = 'Email and password are required';
      console.warn('⚠️ Validation error:', message);
      setError(message);
      notifyError(message);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = 'Please enter a valid email address';
      console.warn('⚠️ Email validation error:', message);
      setError(message);
      notifyError(message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login for:', email);
      await login({ email, password });

      console.log('✅ Login successful, redirecting to:', from);
      success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('❌ Login error caught in component:', err);

      // Handle different error types
      let message = 'Unable to sign in';

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      console.error('📌 Error message:', message);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Admin login</h1>
        <p className="mt-2 text-slate-400">Enter your admin credentials to manage blog content.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="admin@example.com"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>
          {error && (
            <div className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-300" role="alert">
              {error}
            </div>
          )}
          <button
            className="w-full rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
