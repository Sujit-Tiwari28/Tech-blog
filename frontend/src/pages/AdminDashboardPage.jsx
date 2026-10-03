import { useEffect, useState } from 'react';
import postService from '../services/postService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const { error } = useNotification();

  usePageMetadata({ title: 'Dashboard', description: 'Admin dashboard with posts, views, and comment moderation stats.' });

  useEffect(() => {
    postService.getDashboardStats().then(setStats).catch((requestError) => {
      error(requestError.response?.data?.message || 'Unable to load dashboard data');
    });
  }, [error]);

  if (!stats) {
    return <div className="text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total posts</p>
          <p className="mt-4 text-4xl font-semibold text-white">{stats.totalPosts}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total views</p>
          <p className="mt-4 text-4xl font-semibold text-white">{stats.totalViews}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pending comments</p>
          <p className="mt-4 text-4xl font-semibold text-white">{stats.pendingComments}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent posts</p>
          <p className="mt-4 text-4xl font-semibold text-white">{stats.recentPosts.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">Category breakdown</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.categoryStats.map((item) => (
            <div key={item.slug} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-sm text-slate-400">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
