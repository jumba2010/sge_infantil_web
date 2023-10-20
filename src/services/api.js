import axios from 'axios';
import { getToken } from './auth';

export const baseURL = 'https://608xjr0gcg.execute-api.us-east-1.amazonaws.com/test/';

const api = axios.create({
  baseURL: 'https://608xjr0gcg.execute-api.us-east-1.amazonaws.com/test/',
  rejectUnauthorized: false
});

export default api;
