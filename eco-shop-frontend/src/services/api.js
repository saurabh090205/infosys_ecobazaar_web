import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// ── JWT Interceptor ──
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── 401 auto-logout ──
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/');
            if (!isAuthRoute) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth ──
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    validate: (token) => api.post('/auth/validate', { token }),
    changePassword: (data) => api.post('/auth/change-password', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ── Products ──
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getBySeller: (sellerId) => api.get('/products', { params: { sellerId } }),
    getById: (id) => api.get(`/products/${id}`),
    getAlternatives: (id) => api.get(`/products/${id}/alternatives`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// ── Cart ──
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart', data),
    update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`),
};

// ── Orders ──
export const orderAPI = {
    checkout: (data) => api.post('/orders/checkout', data),
    getHistory: () => api.get('/orders'),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// ── Users ──
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

// ── Carbon Insights ──
export const carbonAPI = {
    getUserStats:    () => api.get('/carbon-insights/user-stats'),
    getMonthlyTrend: () => api.get('/carbon-insights/monthly-trend'),
    getTopProducts:  () => api.get('/carbon-insights/top-products'),
};

// ── Admin ──
export const adminAPI = {
    getUsers:             () => api.get('/admin/users'),
    verifyUser:           (id) => api.put(`/admin/users/${id}/verify`),
    getCertifications:    (status) => api.get('/admin/certifications', { params: status ? { status } : {} }),
    reviewCertification:  (id, data) => api.put(`/admin/certifications/${id}/review`, data),
    getPlatformStats:     () => api.get('/admin/platform-stats'),
};

// ── Seller ──
export const sellerAPI = {
    getStats:             () => api.get('/seller/stats'),
    getCertifications:    () => api.get('/seller/certifications'),
    requestCertification: (productId) => api.post('/seller/certifications', { productId }),
};

export default api;
