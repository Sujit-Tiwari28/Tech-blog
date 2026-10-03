import { validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const getCommentsByPostSlug = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug, isPublished: true, isDraft: false });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comments = await Comment.find({ post: post._id, status: 'approved' }).sort({ createdAt: -1 });
  res.json(comments);
};

export const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, content } = req.body;
  const { slug } = req.params;

  const post = await Post.findOne({ slug, isPublished: true, isDraft: false });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = await Comment.create({
    name,
    email,
    content,
    post: post._id,
    status: 'pending',
  });

  res.status(201).json({ message: 'Comment submitted and pending moderation', comment });
};

export const getCommentsAdmin = async (req, res) => {
  const comments = await Comment.find()
    .populate('post', 'title slug')
    .sort({ createdAt: -1 });
  res.json(comments);
};

export const updateCommentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatuses = ['approved', 'rejected'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  comment.status = status;
  await comment.save();

  res.json({ message: `Comment ${status}` });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  await comment.remove();
  res.json({ message: 'Comment deleted' });
};
