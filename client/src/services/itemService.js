import { api } from './api';

export const listItems = () => api.get('/admin/items', true);
export const createItem = (payload) => api.post('/admin/items', payload, true);
export const updateItem = (id, payload) => api.put(`/admin/items/${id}`, payload, true);
export const deleteItem = (id) => api.del(`/admin/items/${id}`, true);
export const duplicateItem = (id) => api.post(`/admin/items/${id}/duplicate`, {}, true);
export const reorderItems = (orderedIds) => api.put('/admin/items/reorder', { orderedIds }, true);
