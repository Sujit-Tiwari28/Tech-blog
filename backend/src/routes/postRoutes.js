import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPost,
  deletePost,
  getPostById,
  getPostsAdmin,
  updatePost,
  uploadCoverImage,
  getDashboardStats,
} from '../controllers/postController.js';

const router = express.Router();
const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDirectory),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, '-');
      cb(null, `${timestamp}-${safeName}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/', getPostsAdmin);
router.get('/:id', getPostById);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validateRequest,
  ],
  createPost
);
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category is required'),
    validateRequest,
  ],
  updatePost
);
router.delete('/:id', deletePost);
router.post('/upload', upload.single('image'), uploadCoverImage);

export default router;
