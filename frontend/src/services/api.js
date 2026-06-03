import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5102/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password, fullName, email) => 
    api.post('/auth/register', { username, password, fullName, email }),
  me: () => api.get('/auth/me'),
};

export const productAPI = {
  getAll: (search = '', category = '') => {
    let url = '/product';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return api.get(url);
  },
  getCategories: () => api.get('/product/categories'),
  getById: (id) => api.get(`/product/${id}`),
  create: (product) => api.post('/product', product),
  update: (id, product) => api.put(`/product/${id}`, product),
  delete: (id) => api.delete(`/product/${id}`),
};

export const orderAPI = {
  create: (order) => api.post('/order', order),
  getMyOrders: () => api.get('/order/my-orders'),
  getAllOrders: () => api.get('/order'),
  updateStatus: (id, status) => api.put(`/order/${id}/status`, { status }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const userAPI = {
  getAll: () => api.get('/user'),
  updateRole: (id, role) => api.put(`/user/${id}/role`, { role }),
  delete: (id) => api.delete(`/user/${id}`),
};

export default api;
