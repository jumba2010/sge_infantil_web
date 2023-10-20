import request from '@/utils/request';

export async function queryCurrent() {
  return {name:"Utilizador de Testes"};
}

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}
