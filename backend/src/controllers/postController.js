import Post from '../models/Post.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';
import { generateSlug } from '../utils/slugify.js';

const buildReadingTime = (text) => {
  const wordsPerMinute = 220;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min read`;
};

export const createPost = async (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    tags,
    coverImage,
    postType,
    isPublished,
    isDraft,
    seoTitle,
    seoDescription,
    scheduledAt,
  } = req.body;

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    return res.status(400).json({ message: 'Category not found' });
  }

  let postSlug = generateSlug(title);
  const existingSlug = await Post.findOne({ slug: postSlug });
  if (existingSlug) {
    postSlug = `${postSlug}-${Date.now()}`;
  }
  const readingTime = buildReadingTime(content);
  // Keep the paired publication fields consistent for API clients that send
  // either field. Posts default to drafts when neither field is provided.
  const shouldPublish = isPublished === true || (isPublished === undefined && isDraft === false);
  const publishDate = shouldPublish ? new Date() : undefined;

  const post = await Post.create({
    title,
    slug: postSlug,
    excerpt,
    content,
    category: categoryDoc._id,
    tags: tags || [],
    coverImage,
    postType,
    readingTime,
    isPublished: shouldPublish,
    isDraft: !shouldPublish,
    publishedAt: publishDate,
    scheduledAt,
    seoTitle,
    seoDescription,
  });

  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (updates.title && updates.title !== post.title) {
    let updatedSlug = generateSlug(updates.title);
    const existingSlug = await Post.findOne({ slug: updatedSlug, _id: { $ne: post._id } });
    if (existingSlug) {
      updatedSlug = `${updatedSlug}-${Date.now()}`;
    }
    post.slug = updatedSlug;
  }

  if (updates.content) {
    post.readingTime = buildReadingTime(updates.content);
  }

  const wasPublished = post.isPublished && !post.isDraft;
  const originalPublishedAt = post.publishedAt;
  const hasPublishUpdate = Object.hasOwn(updates, 'isPublished') || Object.hasOwn(updates, 'isDraft');
  Object.assign(post, updates);
  if (hasPublishUpdate) {
    // Accept either existing schema field while always persisting them as a
    // consistent pair. Preserve the original date when an already published
    // post is edited; clear it when the post returns to draft.
    const shouldPublish = Object.hasOwn(updates, 'isPublished')
      ? updates.isPublished === true
      : updates.isDraft === false;
    post.isPublished = shouldPublish;
    post.isDraft = !shouldPublish;
    if (shouldPublish) post.publishedAt = wasPublished ? originalPublishedAt : new Date();
    if (!shouldPublish) post.publishedAt = undefined;
  }

  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  await post.remove();
  res.json({ message: 'Post removed successfully' });
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('category');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};

export const getPostsAdmin = async (req, res) => {
  const posts = await Post.find().populate('category').sort({ createdAt: -1 });
  res.json(posts);
};

export const getDashboardStats = async (req, res) => {
  const totalPosts = await Post.countDocuments();
  const totalViews = await Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
  const pendingComments = await Comment.countDocuments({ status: 'pending' });
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).select('title slug isPublished createdAt');
  const categoryStats = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { count: 1, name: '$category.name', slug: '$category.slug' } },
  ]);

  res.json({
    totalPosts,
    totalViews: totalViews[0]?.total || 0,
    pendingComments,
    recentPosts,
    categoryStats,
  });
};

export const uploadCoverImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ coverImage: imageUrl });
};
