import { api } from './api';

export const listCategories = () => api.get('/admin/categories', true);
export const createCategory = (payload) => api.post('/admin/categories', payload, true);
export const updateCategory = (id, payload) => api.put(`/admin/categories/${id}`, payload, true);
export const deleteCategory = (id) => api.del(`/admin/categories/${id}`, true);
export const reorderCategories = (orderedIds) => api.put('/admin/categories/reorder', { orderedIds }, true);
