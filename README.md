# Personal Tech Blog Platform

A production-ready MERN blog and portfolio platform with admin moderation and public content support.

## Project Overview

This repository contains two applications:

- `backend`: Node.js + Express + MongoDB API for authentication, blog management, categories, comments, and public content.
- `frontend`: React + Vite + Tailwind CSS public website and admin dashboard.

## Key Features

Public:
- Responsive blog landing, category browsing, search, filters, and pagination
- Article detail page with related posts and approved comment support
- Contact, about, skills, and portfolio sections
- SEO-friendly page titles and meta descriptions
- Toast notifications and loading states for a polished user experience

Admin:
- JWT-based admin authentication and protected dashboard routes
- Post management with draft, publish, tags, SEO metadata, and cover image upload
- Category management and comment moderation
- Dashboard stats for total posts, views, recent posts, and pending comments

Developer:
- ESLint and Prettier configuration for consistent code style
- `.env.example` files for backend and frontend environment setup
- Modular API services and reusable React hooks

## Folder Structure

- `backend/`
  - `src/controllers`
  - `src/models`
  - `src/routes`
  - `src/middleware`
  - `src/config`
  - `src/seed`
  - `src/utils`

- `frontend/`
  - `src/components`
  - `src/pages`
  - `src/layouts`
  - `src/context`
  - `src/hooks`
  - `src/services`

## Setup Guide

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Configure:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
   - `SEED_ADMIN_EMAIL`
   - `SEED_ADMIN_PASSWORD`
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Seed the admin user:
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Update `VITE_API_BASE_URL` if needed.
3. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Linting and Formatting

### Backend

```bash
cd backend
npm run lint
npm run format
```

### Frontend

```bash
cd frontend
npm run lint
npm run format
```

## Deployment Guide

### Frontend

- Deploy the `frontend` app with Vite-compatible hosting.
- Set `VITE_API_BASE_URL` to your backend API deployment.

### Backend

- Deploy the `backend` app to Node hosting.
- Provide environment variables and MongoDB Atlas connection details.
- Ensure `CLIENT_URL` matches the frontend deployment.

## Environment Variables

### Backend `.env`

```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=StrongP@ssword1
```

### Frontend `.env`

```text
VITE_API_BASE_URL=http://localhost:5000/api
```

## Notes

- Public registration is not available; only seeded or configured admins can log in.
- Comments are stored as pending until approved by the admin.
- Posts are protected by categories, tags, drafts, and published status.
- The backend serves uploaded cover images from `/uploads`.
