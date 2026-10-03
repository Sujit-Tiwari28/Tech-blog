import Category from '../models/Category.js';
import slugify from 'slugify';

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const existing = await Category.findOne({ slug });
  if (existing) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = await Category.create({ name, description, slug });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (name && name !== category.name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }
  if (description) category.description = description;

  await category.save();
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  await category.remove();
  res.json({ message: 'Category deleted' });
};
