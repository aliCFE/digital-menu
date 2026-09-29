import { api } from './api';

export const placeOrder = (payload) => api.post('/orders', payload);
export const listOrders = () => api.get('/orders', true);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status }, true);
export const deleteOrder = (id) => api.del(`/orders/${id}`, true);
