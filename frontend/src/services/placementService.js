import api from '../api';

export const getPlacements = () => api.get('/api/placements');
export const getPlacementById = (id) => api.get(`/api/placements/${id}`);
export const applyPlacement = (id) => api.post(`/api/placements/${id}/apply`);
export const createPlacement = (data) => api.post('/api/placements', data);
