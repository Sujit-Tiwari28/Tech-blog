import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-indigo-500/30">
      <div className="space-y-4">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="h-52 w-full rounded-3xl object-cover" />
        )}
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">{post.category?.name || 'Tech'}</p>
          <h3 className="text-xl font-semibold text-white transition group-hover:text-indigo-300">{post.title}</h3>
          <p className="text-slate-400 line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>{post.readingTime}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-indigo-300 transition hover:text-white"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
