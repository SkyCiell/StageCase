import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
};

export const concertService = {
  list: (params) => api.get('/concerts', { params }),
  getBySlug: (slug) => api.get(`/concerts/${slug}`),
  getSeats: (id) => api.get(`/concerts/${id}/seats`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  myBookings: (params) => api.get('/bookings/my', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
};

export const paymentService = {
  uploadProof: (bookingId, formData) =>
    api.post(`/payments/${bookingId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const notificationService = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const favoriteService = {
  list: () => api.get('/favorites'),
  toggle: (concert_id) => api.post('/favorites/toggle', { concert_id }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/users/change-password', data),
};

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  // Concerts
  concerts: (params) => api.get('/admin/concerts', { params }),
  createConcert: (formData) => api.post('/admin/concerts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateConcert: (id, formData) => api.put(`/admin/concerts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteConcert: (id) => api.delete(`/admin/concerts/${id}`),
  // Venues
  createVenue: (data) => api.post('/admin/venues', data),
  updateVenue: (id, data) => api.put(`/admin/venues/${id}`, data),
  deleteVenue: (id) => api.delete(`/admin/venues/${id}`),
  // Users
  users: (params) => api.get('/admin/users', { params }),
  // Bookings
  bookings: (params) => api.get('/admin/bookings', { params }),
  approvePayment: (id) => api.patch(`/admin/payments/${id}/approve`),
  rejectPayment: (id, reason) => api.patch(`/admin/payments/${id}/reject`, { reason }),
  // Ticket categories
  createCategory: (data) => api.post('/admin/ticket-categories', data),
  updateCategory: (id, data) => api.put(`/admin/ticket-categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/ticket-categories/${id}`),
  generateSeats: (data) => api.post('/admin/seats/generate', data),
};

export { getImageUrl } from './api';

