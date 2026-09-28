import { api } from './api';

export const getPublicMenu = (slug) => api.get(`/restaurants/${slug}`);
export const trackView = (slug) => api.post(`/restaurants/${slug}/view`, {});

export const getMyRestaurant = () => api.get('/restaurants/admin/me', true);
export const updateMyRestaurant = (payload) => api.put('/restaurants/admin/me', payload, true);
export const updateMyTheme = (theme) => api.put('/restaurants/admin/theme', theme, true);
export const getDashboardStats = () => api.get('/restaurants/admin/dashboard', true);
