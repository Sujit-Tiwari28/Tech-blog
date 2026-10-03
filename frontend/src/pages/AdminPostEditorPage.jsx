import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../services/categoryService.js';
import postService from '../services/postService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminPostEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    postType: 'Article',
    isPublished: false,
    isDraft: true,
    seoTitle: '',
    seoDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [error, setError] = useState('');
  const { success, error: notifyError } = useNotification();

  usePageMetadata({
    title: id ? 'Edit post' : 'New post',
    description: id ? 'Edit your blog post in the admin dashboard.' : 'Create a new post for the blog.',
  });

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch(() => notifyError('Unable to load categories. Please try again.'))
      .finally(() => setCategoriesLoading(false));
  }, [notifyError]);

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      const post = await postService.getPostById(id);
      setValues({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category?._id || '',
        tags: (post.tags || []).join(', '),
        coverImage: post.coverImage || '',
        postType: post.postType || 'Article',
        isPublished: post.isPublished,
        isDraft: post.isDraft,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
      });
    };
    loadPost();
  }, [id]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!values.title || !values.content || !values.category) {
      const message = 'Title, content, and category are required.';
      setError(message);
      notifyError(message);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...values,
        tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      if (id) {
        await postService.updatePost(id, payload);
        success('Post updated successfully');
      } else {
        await postService.createPost(payload);
        success('Post created successfully');
      }
      navigate('/admin/posts');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to save post';
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name);
    setUploading(true);
    setError('');
    try {
      const data = await postService.uploadImage(file);
      setValues((prev) => ({ ...prev, coverImage: data.coverImage }));
      success('Cover image uploaded successfully');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Image upload failed';
      setError(message);
      notifyError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">{id ? 'Edit post' : 'New post'}</h1>
        <p className="text-slate-400">Publish articles, drafts, and schedule content for your personal blog.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Title</label>
            <input
              value={values.title}
              onChange={handleChange('title')}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Category</label>
            <select
              value={values.category}
              onChange={handleChange('category')}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
              required
            >
              <option value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
              {categories.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
            {!categoriesLoading && categories.length === 0 && (
              <p className="text-sm text-amber-300">No categories exist yet. Add one from the <a className="underline" href="/admin/categories">Categories</a> page.</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-slate-300">Excerpt</label>
          <textarea
            value={values.excerpt}
            onChange={handleChange('excerpt')}
            rows="4"
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-slate-300">Content</label>
          <textarea
            value={values.content}
            onChange={handleChange('content')}
            rows="12"
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none font-mono"
            placeholder="Use HTML or markdown-friendly content here"
            required
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Tags</label>
            <input
              value={values.tags}
              onChange={handleChange('tags')}
              placeholder="e.g. react, nodejs, interview"
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Cover image URL</label>
            <input
              value={values.coverImage}
              onChange={handleChange('coverImage')}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Upload cover image</label>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-slate-300" disabled={uploading} />
            {selectedFileName && <p className="text-sm text-slate-400">{uploading ? 'Uploading' : 'Selected'}: {selectedFileName}</p>}
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Post type</label>
            <select
              value={values.postType}
              onChange={handleChange('postType')}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            >
              <option>Article</option>
              <option>Tutorial</option>
              <option>Project</option>
              <option>News</option>
              <option>Career</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={values.isPublished && !values.isDraft}
                onChange={(event) => {
                  const isPublished = event.target.checked;
                  setValues((prev) => ({ ...prev, isPublished, isDraft: !isPublished }));
                }}
              />
              Publish post
            </label>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">SEO title</label>
            <input
              value={values.seoTitle}
              onChange={handleChange('seoTitle')}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-slate-300">SEO description</label>
          <textarea
            value={values.seoDescription}
            onChange={handleChange('seoDescription')}
            rows="3"
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400"
          disabled={loading}
        >
          {loading ? 'Saving...' : id ? 'Update post' : 'Create post'}
        </button>
      </form>
    </div>
  );
};

export default AdminPostEditorPage;
