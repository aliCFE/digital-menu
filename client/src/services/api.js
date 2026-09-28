const TOKEN_KEY = 'digital_menu_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  let payload = body;

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, { method, headers, body: payload });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path, auth = false) => request(path, { method: 'GET', auth }),
  post: (path, body, auth = false) => request(path, { method: 'POST', body, auth }),
  put: (path, body, auth = false) => request(path, { method: 'PUT', body, auth }),
  del: (path, auth = false) => request(path, { method: 'DELETE', auth }),
};

export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Upload failed');
  return data.url;
}
