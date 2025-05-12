import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apic.polytech.kz/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default api;