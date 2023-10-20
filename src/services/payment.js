import request from '@/utils/request';
import { baseURL } from './api';
import { SUCURSAL } from './auth';

export async function findUnpaidPayments() {
  return await API.get(
    baseURL + `api/payment/unpaid/${JSON.parse(localStorage.getItem(SUCURSAL)).id}`
  );
}

export async function findPaidPayments() {
  return await API.get(
    baseURL + `api/payment/paid/${JSON.parse(localStorage.getItem(SUCURSAL)).id}/${this.state.year}`
  );
}


