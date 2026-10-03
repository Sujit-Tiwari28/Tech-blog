import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard.jsx';
import Pagination from '../components/Pagination.jsx';
import postService from '../services/postService.js';
import categoryService from '../services/categoryService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { error: notifyError } = useNotification();

  usePageMetadata({
    title: 'Blog',
    description: 'Browse the TechBlog article library with search, filters, and pagination.',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getPosts({ page, limit: 12, search, category });
        setPosts(data.posts);
        setPages(data.pages);
      } catch (err) {
        notifyError(err.response?.data?.message || 'Unable to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, search, category, notifyError]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white">All articles</h1>
          <p className="text-slate-400">Filter by topic, search by title, and discover professional blog content.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title"
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500 sm:w-72"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none sm:w-72"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-slate-400">Loading posts...</p>
        ) : posts.length ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="col-span-full text-slate-400">No articles match your search.</p>
        )}
      </div>

      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  );
};

export default BlogPage;
