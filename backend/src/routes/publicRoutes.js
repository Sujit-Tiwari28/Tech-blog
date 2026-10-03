import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  getHomepage,
  getPostBySlug,
  listPosts,
  getPostCounts,
} from '../controllers/publicController.js';
import { getCommentsByPostSlug, createComment } from '../controllers/commentController.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/home', getHomepage);
router.get('/posts', listPosts);
router.get('/posts/counts', getPostCounts);
router.get('/posts/:slug/comments', getCommentsByPostSlug);
router.post(
  '/posts/:slug/comments',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('content').notEmpty().withMessage('Comment cannot be empty'),
  ],
  validateRequest,
  createComment
);
router.get('/posts/:slug', getPostBySlug);

export default router;
