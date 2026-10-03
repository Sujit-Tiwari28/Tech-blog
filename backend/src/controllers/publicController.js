import Post from '../models/Post.js';
import Category from '../models/Category.js';

export const getHomepage = async (req, res) => {
  const featuredPosts = await Post.find({ isPublished: true, isDraft: false })
    .sort({ views: -1, publishedAt: -1 })
    .limit(4)
    .populate('category');

  const latestPosts = await Post.find({ isPublished: true, isDraft: false })
    .sort({ publishedAt: -1 })
    .limit(6)
    .populate('category');

  const popularPosts = await Post.find({ isPublished: true, isDraft: false })
    .sort({ views: -1 })
    .limit(6)
    .populate('category');

  const categories = await Category.find().limit(12);

  res.json({ featuredPosts, latestPosts, popularPosts, categories });
};

export const listPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';
  const category = req.query.category;
  const tags = req.query.tags ? req.query.tags.split(',') : [];

  const filters = { isPublished: true, isDraft: false };
  if (search) filters.title = { $regex: search, $options: 'i' };
  if (category) filters.category = category;
  if (tags.length) filters.tags = { $in: tags.map((tag) => tag.trim().toLowerCase()) };

  const total = await Post.countDocuments(filters);
  const posts = await Post.find(filters)
    .populate('category')
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    posts,
  });
};

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug, isPublished: true, isDraft: false }).populate('category');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.views += 1;
  await post.save();

  const relatedPosts = await Post.find({
    _id: { $ne: post._id },
    category: post.category._id,
    isPublished: true,
    isDraft: false,
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .populate('category');

  res.json({ post, relatedPosts });
};

export const getPostCounts = async (req, res) => {
  const total = await Post.countDocuments({ isPublished: true, isDraft: false });
  const categories = await Category.find();
  res.json({ total, categories });
};
