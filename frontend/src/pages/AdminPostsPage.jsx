import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/postService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: notifyError } = useNotification();

  usePageMetadata({ title: 'Posts manager', description: 'Manage blog posts from the admin dashboard.' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await postService.getAdminPosts();
        setPosts(data);
      } catch (err) {
        notifyError(err.response?.data?.message || 'Unable to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [notifyError]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Post manager</h1>
          <p className="text-slate-400">Edit, publish, or remove your blog content.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400"
        >
          Create new post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead>
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan="4">
                  Loading posts...
                </td>
              </tr>
            ) : posts.length ? (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-4 py-4 text-white">{post.title}</td>
                  <td className="px-4 py-4">{post.isPublished ? 'Published' : 'Draft'}</td>
                  <td className="px-4 py-4">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'TBD'}</td>
                  <td className="px-4 py-4 space-x-2">
                    <Link
                      to={`/admin/posts/${post._id}/edit`}
                      className="rounded-full bg-slate-800 px-4 py-2 text-xs text-slate-200 hover:bg-slate-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan="4">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostsPage;
