import axios from 'axios';
// import { getToken } from './auth';

// export const baseURL = 'https://fs952vsnm3.execute-api.us-east-1.amazonaws.com/dev/';

// const api = axios.create({
//   baseURL: 'https://fs952vsnm3.execute-api.us-east-1.amazonaws.com/dev/',
//   rejectUnauthorized: false,
// });

export const baseURL = 'http://localhost:3333/';

const api = axios.create({
  baseURL: 'http://localhost:3333/',
  rejectUnauthorized: false,
});

export default api;
