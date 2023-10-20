import request from '@/utils/request';
import API,{ baseURL, } from './api';
import { SUCURSAL } from './auth';

export async function findActiveStudents() {
  return await API.get(
    baseURL + 'api/registration/current/' + JSON.parse(localStorage.getItem(SUCURSAL)).id,
  );
}

export async function findUnrenewedStudents() {
  return  await API.get(
    baseURL + 'api/student/unrenewd/sucursal/' + JSON.parse(localStorage.getItem(SUCURSAL)).id,
  );
}

export async function findActiveStudentById(registrationId) {
  console.log('Calling endpoint',registrationId)
  return  await API.get(
    baseURL + 'api/registration/' + registrationId,
  );
}

export async function findFrequencies() {
  let resp=  await API.get(
    baseURL + 'api/frequency/' + JSON.parse(localStorage.getItem(SUCURSAL)).id,
  );
  return resp
}

