
import api from './axios';

export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    getByBarcode: (code) => api.get(`/products/barcode/${encodeURIComponent(code)}`),
};
