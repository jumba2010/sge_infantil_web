import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'Requisição processada com Sucesso',
  201: 'Requisição processada com Sucesso com resposta',
  202: 'Requisição parcialmente processada e sem resposta',
  204: 'Requisição  sem resposta',
  400: 'Requisição inválida',
  401: 'Acesso Não autorizado',
  403: 'Recurso Proibido',
  404: 'Requisição não encontrada',
  406: 'Requisição rejeitada',
  410: 'Recurso não mais disponível',
  422: 'Entidade improcessável',
  500: 'Erro interno do servidor',
  502: 'Bad Gateway',
  503: 'Serviço indisponível',
  504: 'Gateway Time-Out',
};

const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Resposta ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
      notification.error({
      description: codeMessage[404],
      message: 'Erro ao processar o pedido',
    });
  }
  return response;
};


const request = extend({
  errorHandler, 
  credentials: 'include', 
});

export default request;
