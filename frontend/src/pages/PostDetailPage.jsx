import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import postService from '../services/postService.js';
import commentService from '../services/commentService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const PostDetailPage = () => {
  const { slug } = useParams();
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [commentLoading, setCommentLoading] = useState(false);
  const { success, error: notifyError } = useNotification();

  usePageMetadata({
    title: postData?.post?.title ? `${postData.post.title}` : 'Article',
    description: postData?.post?.seoDescription || postData?.post?.excerpt || 'Read technical articles from the TechBlog platform.',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await postService.getPostBySlug(slug);
        setPostData(data);
        const commentsData = await commentService.getCommentsBySlug(slug);
        setComments(commentsData);
      } catch (err) {
        notifyError(err.response?.data?.message || 'Unable to load article');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, notifyError]);

  const handleCommentChange = (field) => (event) => {
    setCommentForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const { name, email, content } = commentForm;
    if (!name || !email || !content) {
      notifyError('Please complete all comment fields.');
      return;
    }

    setCommentLoading(true);
    try {
      await commentService.submitComment(slug, { name, email, content });
      setCommentForm({ name: '', email: '', content: '' });
      success('Comment submitted for moderation.');
    } catch (err) {
      notifyError(err.response?.data?.message || 'Unable to submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-[72vh] flex items-center justify-center text-slate-400">Loading article...</div>;
  }

  if (!postData?.post) {
    return <div className="min-h-[72vh] flex items-center justify-center text-slate-400">Article not found.</div>;
  }

  const { post, relatedPosts } = postData;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.32em] text-indigo-300">{post.category?.name}</p>
        <h1 className="text-4xl font-semibold text-white">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>{post.readingTime}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="rounded-3xl object-cover" />}
        <div className="prose prose-invert max-w-none mt-6 text-slate-200">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        <div className="flex flex-wrap gap-2 pt-6">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Comments</h2>
            {comments.length ? (
              <div className="mt-6 space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                      <span>{comment.name}</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-slate-200">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No comments have been approved yet.</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Leave a comment</h2>
            <p className="mt-2 text-slate-400">Your comment will appear once approved by the admin.</p>
            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={commentForm.name}
                  onChange={handleCommentChange('name')}
                  placeholder="Name"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
                  required
                />
                <input
                  type="email"
                  value={commentForm.email}
                  onChange={handleCommentChange('email')}
                  placeholder="Email"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
                  required
                />
              </div>
              <textarea
                value={commentForm.content}
                onChange={handleCommentChange('content')}
                rows="5"
                placeholder="Write your comment"
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {commentLoading ? 'Submitting...' : 'Submit comment'}
              </button>
            </form>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Related articles</h3>
          <div className="mt-6 space-y-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
                className="block rounded-3xl border border-slate-800 bg-slate-950/80 p-4 transition hover:border-indigo-500"
              >
                <h4 className="text-lg font-semibold text-white">{related.title}</h4>
                <p className="mt-2 text-slate-400 line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default PostDetailPage;
