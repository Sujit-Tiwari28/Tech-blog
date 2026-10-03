import { useCallback, useEffect, useState } from 'react';
import commentService from '../services/commentService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error: notifyError } = useNotification();

  usePageMetadata({ title: 'Comment moderation', description: 'Manage blog comments and approve or reject new feedback.' });

  const loadComments = useCallback(async () => {
    try {
      const data = await commentService.getAdminComments();
      setComments(data);
    } catch (err) {
      notifyError(err.response?.data?.message || 'Unable to load comments');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(true);
    try {
      await commentService.updateCommentStatus(id, status);
      success(`Comment ${status}`);
      await loadComments();
    } catch (err) {
      notifyError(err.response?.data?.message || 'Unable to update comment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await commentService.deleteComment(id);
      success('Comment deleted');
      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (err) {
      notifyError(err.response?.data?.message || 'Unable to delete comment');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Comment moderation</h1>
        <p className="text-slate-400">Approve or reject new comments before they appear on the public blog.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead>
            <tr>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Post</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan="5">
                  Loading comments...
                </td>
              </tr>
            ) : comments.length ? (
              comments.map((comment) => (
                <tr key={comment._id}>
                  <td className="px-4 py-4 max-w-xl truncate text-white">{comment.content}</td>
                  <td className="px-4 py-4 text-slate-300">{comment.post?.title || 'Unknown post'}</td>
                  <td className="px-4 py-4 text-slate-300">{comment.status}</td>
                  <td className="px-4 py-4 text-slate-300">{new Date(comment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button
                      className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={actionLoading || comment.status === 'approved'}
                      onClick={() => handleStatusChange(comment._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-full bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={actionLoading || comment.status === 'rejected'}
                      onClick={() => handleStatusChange(comment._id, 'rejected')}
                    >
                      Reject
                    </button>
                    <button
                      className="rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={actionLoading}
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan="5">
                  No comments awaiting moderation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCommentsPage;
