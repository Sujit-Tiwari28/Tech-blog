import { useEffect, useState } from 'react';
import categoryService from '../services/categoryService.js';
import { useNotification } from '../context/NotificationContext.jsx';
import usePageMetadata from '../hooks/usePageMetadata.jsx';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useNotification();

  usePageMetadata({ title: 'Categories', description: 'Manage post categories.' });

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch(() => error('Unable to load categories'))
      .finally(() => setLoading(false));
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const category = await categoryService.createCategory({ name: name.trim(), description: description.trim() });
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setDescription('');
      success('Category created successfully');
    } catch (requestError) {
      error(requestError.response?.data?.message || 'Unable to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Categories</h1>
        <p className="text-slate-400">Create categories before assigning them to posts.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:grid-cols-[1fr_2fr_auto]">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" required className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
        <button disabled={saving} className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? 'Adding...' : 'Add category'}</button>
      </form>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        {loading ? <p className="text-slate-400">Loading categories...</p> : categories.length ? <ul className="space-y-3">{categories.map((category) => <li key={category._id} className="rounded-2xl bg-slate-900 px-4 py-3"><p className="font-medium text-white">{category.name}</p>{category.description && <p className="text-sm text-slate-400">{category.description}</p>}</li>)}</ul> : <p className="text-slate-400">No categories yet. Add your first category above.</p>}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
