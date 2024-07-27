import API, { baseURL } from './api';
import { SUCURSAL } from './auth';

export async function findActiveStudents() {
  const resp = await API.get(
    `${baseURL}api/registration/current/${JSON.parse(localStorage.getItem(SUCURSAL)).id}`,
  );
  return resp;
}

export async function findUnrenewedStudents() {
  return API.get(
    `${baseURL}api/student/unrenewd/sucursal/${JSON.parse(localStorage.getItem(SUCURSAL)).id}`,
  );
}

export async function findActiveStudentById(registrationId) {
  return API.get(`${baseURL}api/registration/${registrationId}`);
}

export async function findFrequencies() {
  const resp = await API.get(
    `${baseURL}api/frequency/${JSON.parse(localStorage.getItem(SUCURSAL)).id}`,
  );
  return resp;
}
