import axios from 'axios';
import { getToken } from './auth';

export const baseURL = 'http://localhost:3333/';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
  rejectUnauthorized: false
});

export default api;
