import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/postService.js';
import PostCard from '../components/PostCard.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const HomePage = () => {
  const [data, setData] = useState({ featuredPosts: [], latestPosts: [], popularPosts: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const { error: notifyError } = useNotification();

  usePageMetadata({
    title: 'Home',
    description: 'TechBlog shares tutorials, project stories, and engineering insights for modern developers.',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const homepage = await postService.getHomepage();
        setData(homepage);
      } catch (err) {
        notifyError(err.response?.data?.message || 'Unable to load homepage');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [notifyError]);

  if (loading) {
    return <div className="min-h-[72vh] flex items-center justify-center text-slate-400">Loading homepage...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Software engineering blog</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Build better apps with expert articles on JavaScript, React, Node, AI, and career growth.
          </h1>
          <p className="max-w-2xl text-slate-400">
            Explore tutorials, coding strategies, interview preparation, developer tools, and personal project stories.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/blog" className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400">
              Explore articles
            </Link>
            <Link to="/projects" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-200 transition hover:border-indigo-500">
              See projects
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured article</p>
          {data.featuredPosts[0] ? (
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold text-white">{data.featuredPosts[0].title}</h2>
              <p className="text-slate-400">{data.featuredPosts[0].excerpt}</p>
              <Link to={`/blog/${data.featuredPosts[0].slug}`} className="text-indigo-300 hover:text-white">
                Read the story →
              </Link>
            </div>
          ) : (
            <p className="text-slate-500">No featured posts available yet.</p>
          )}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">Latest articles</h2>
            <p className="text-slate-400">Fresh ideas, code walkthroughs, and tutorials from the blog.</p>
          </div>
          <Link to="/blog" className="text-sm font-medium text-indigo-300 hover:text-white">
            Browse all posts
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">Popular reads</h2>
            <p className="text-slate-400">In-depth guides and problem-solving posts readers love.</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {data.popularPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Explore categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {data.categories.map((category) => (
            <span key={category.slug} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
              {category.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
