const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = (isJson = true) => {
  const h = {};
  if (isJson) h['Content-Type'] = 'application/json';
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

export const login = async (email, password) => {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const register = async (data) => {
  const res = await fetch(`${API_ROOT}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchSessions = async () => {
  const res = await fetch(`${API_ROOT}/sessions`, { headers: headers() });
  return res.json();
};

export const createSession = async (payload) => {
  const res = await fetch(`${API_ROOT}/sessions`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const updateSessionStatus = async (id, status) => {
  const res = await fetch(`${API_ROOT}/sessions/${id}/status`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ status })
  });
  return res.json();
};

export const getSession = async (id) => {
  const res = await fetch(`${API_ROOT}/sessions/${id}`, { headers: headers() });
  return res.json();
};
