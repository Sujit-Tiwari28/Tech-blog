import api from './api.js';

const getHomepage = async () => {
  const response = await api.get('/public/home');
  return response.data;
};

const getPosts = async (params) => {
  const response = await api.get('/public/posts', { params });
  return response.data;
};

const getPostBySlug = async (slug) => {
  const response = await api.get(`/public/posts/${slug}`);
  return response.data;
};

const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

const getAdminPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

const getDashboardStats = async () => {
  const response = await api.get('/posts/dashboard');
  return response.data;
};

const createPost = async (formData) => {
  const response = await api.post('/posts', formData);
  return response.data;
};

const updatePost = async (id, formData) => {
  const response = await api.put(`/posts/${id}`, formData);
  return response.data;
};

const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

const uploadImage = async (file) => {
  const form = new FormData();
  form.append('image', file);
  const response = await api.post('/posts/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const postService = {
  getHomepage,
  getPosts,
  getPostBySlug,
  getPostById,
  getAdminPosts,
  getDashboardStats,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
};

export default postService;
