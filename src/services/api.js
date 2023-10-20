import axios from 'axios';
import { getToken } from './auth';

export const baseURL = 'https://bz2d6disx4.execute-api.us-east-1.amazonaws.com/prod/';

const api = axios.create({
  baseURL: 'https://bz2d6disx4.execute-api.us-east-1.amazonaws.com/prod',
  rejectUnauthorized: false
});

export default api;
