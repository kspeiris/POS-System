
import api from './axios';

export const orderApi = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    getReceipt: (id) => api.get(`/orders/${id}/receipt`),
    voidOrder: (id, data) => api.patch(`/orders/${id}/void`, data),
    refundOrder: (id, data) => api.patch(`/orders/${id}/refund`, data),
};
