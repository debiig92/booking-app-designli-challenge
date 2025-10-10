'use client';
import axios from 'axios';
const api = axios.create({ baseURL: '/api/backend' });
export { api };
