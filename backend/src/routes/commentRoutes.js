import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCommentsAdmin,
  updateCommentStatus,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(protect);
router.get('/', getCommentsAdmin);
router.put('/:id', [body('status').notEmpty().withMessage('Status is required'), validateRequest], updateCommentStatus);
router.delete('/:id', deleteComment);

export default router;
