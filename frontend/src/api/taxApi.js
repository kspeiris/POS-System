
import api from './axios';

export const taxApi = {
    getAll: () => api.get('/tax-rules'),
    getActive: () => api.get('/tax-rules/active'),
    create: (data) => api.post('/tax-rules', data),
    update: (id, data) => api.put(`/tax-rules/${id}`, data),
    delete: (id) => api.delete(`/tax-rules/${id}`),
};
