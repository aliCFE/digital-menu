import { api, setToken } from './api';

export async function login(username, password) {
  const data = await api.post('/auth/login', { username, password });
  setToken(data.token);
  return data.admin;
}

export function logout() {
  setToken(null);
}

export function getMe() {
  return api.get('/auth/me', true);
}

export function updateProfile(payload) {
  return api.put('/auth/me', payload, true);
}
