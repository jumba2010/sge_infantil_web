
import { FormDataType } from './index';
import api from './../../../services/api';
import { notification } from 'antd';

export async function fakeAccountLogin(params: FormDataType) {

 var response =await api.post("/api/auth", {
    params
})
.catch(function (error) {  
  notification.error({
      description:'Servidor indisponível',
      message: 'Erro ao processar o pedido',
    });   
});

return response.data;

}
