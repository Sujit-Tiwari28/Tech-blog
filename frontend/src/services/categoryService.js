import api from './api.js';

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const createCategory = async (category) => {
  const response = await api.post('/categories', category);
  return response.data;
};

const categoryService = {
  getCategories,
  createCategory,
};

export default categoryService;
