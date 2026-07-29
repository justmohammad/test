import api from './api';

export const customerService = {
  // دریافت لیست مشتریان
  getAll: () => api.get('/customers'),
  
  // دریافت یک مشتری
  getById: (id) => api.get(`/customers/${id}`),
  
  // ایجاد مشتری جدید
  create: (data) => api.post('/customers', data),
  
  // ویرایش مشتری
  update: (id, data) => api.put(`/customers/${id}`, data),
  
  // حذف مشتری
  delete: (id) => api.delete(`/customers/${id}`),
  
  // جستجوی مشتریان
  search: (query) => api.get('/customers/search', { params: { q: query } }),
};

export const dealService = {
  // دریافت لیست معاملات
  getAll: () => api.get('/deals'),
  
  // دریافت یک معامله
  getById: (id) => api.get(`/deals/${id}`),
  
  // ایجاد معامله جدید
  create: (data) => api.post('/deals', data),
  
  // ویرایش معامله
  update: (id, data) => api.put(`/deals/${id}`, data),
  
  // حذف معامله
  delete: (id) => api.delete(`/deals/${id}`),
  
  // تغییر وضعیت معامله
  updateStatus: (id, status) => api.patch(`/deals/${id}/status`, { status }),
};

export const taskService = {
  // دریافت لیست وظایف
  getAll: () => api.get('/tasks'),
  
  // دریافت یک وظیفه
  getById: (id) => api.get(`/tasks/${id}`),
  
  // ایجاد وظیفه جدید
  create: (data) => api.post('/tasks', data),
  
  // ویرایش وظیفه
  update: (id, data) => api.put(`/tasks/${id}`, data),
  
  // حذف وظیفه
  delete: (id) => api.delete(`/tasks/${id}`),
  
  // تغییر وضعیت وظیفه
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
};

export const authService = {
  // ورود
  login: (credentials) => api.post('/auth/login', credentials),
  
  // خروج
  logout: () => api.post('/auth/logout'),
  
  // ثبت نام
  register: (data) => api.post('/auth/register', data),
  
  // دریافت اطلاعات کاربر فعلی
  getCurrentUser: () => api.get('/auth/me'),
};
