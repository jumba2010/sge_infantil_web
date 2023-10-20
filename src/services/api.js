import axios from 'axios';
import { getToken } from './auth';

export const baseURL = 'https://yttv6i509f.execute-api.us-east-1.amazonaws.com/dev/';

const api = axios.create({
  baseURL: 'https://yttv6i509f.execute-api.us-east-1.amazonaws.com/dev/',
  rejectUnauthorized: false
});

export default api;
