import contactRoutes from "./routes/contactRoutes.js";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5000;

// CORS configuration: Allow multiple Vite dev ports
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:3000',

  // Production frontend
  'https://tech-blog-sage-zeta.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔄 CORS request from origin: ${origin}`);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    auth: req.headers.authorization ? 'present' : 'missing',
    body: req.method !== 'GET' ? req.body : undefined,
  });
  next();
});

const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');
app.use(
  '/uploads',
  (req, res, next) => {
    // Cover images are public assets rendered by the frontend on a different
    // localhost port (and potentially a separate frontend origin in deploys).
    // Override Helmet's default same-origin policy for these assets only.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadsDirectory)
);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/comments', commentRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
      console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Use a different PORT or stop the process using it.`);
        process.exit(1);
      }
      throw error;
    });
  } catch (error) {
    console.error('❌ Backend stopped because MongoDB is unavailable. Check MONGO_URI and Atlas network access.');
    process.exit(1);
  }
};

startServer();
