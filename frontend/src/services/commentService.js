import api from './api.js';

const getCommentsBySlug = async (slug) => {
  const response = await api.get(`/public/posts/${slug}/comments`);
  return response.data;
};

const submitComment = async (slug, comment) => {
  const response = await api.post(`/public/posts/${slug}/comments`, comment);
  return response.data;
};

const getAdminComments = async () => {
  const response = await api.get('/comments');
  return response.data;
};

const updateCommentStatus = async (id, status) => {
  const response = await api.put(`/comments/${id}`, { status });
  return response.data;
};

const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

const commentService = {
  getCommentsBySlug,
  submitComment,
  getAdminComments,
  updateCommentStatus,
  deleteComment,
};

export default commentService;
