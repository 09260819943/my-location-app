import axios from "axios";

// Use your LAN IP + services endpoint
const API_URL = 'http://10.0.0.47:8000/api/services/';

export const getServices = () => axios.get(API_URL);
export const createService = (data) => axios.post(API_URL, data);
export const updateService = (id, data) => axios.put(`${API_URL}${id}/`, data);
export const getService = (id) => axios.get(`${API_URL}${id}/`);
export const deleteService = (id) => axios.delete(`${API_URL}${id}/`);
