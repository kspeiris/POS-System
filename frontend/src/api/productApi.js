
import api from './axios';

export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    getLowStock: () => api.get('/products/low-stock'),
    uploadImage: (id, file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.put(`/products/${id}/upload-image`, formData);
    },
};
