/**
 * src/config/apiAxios.js
 */

import axios from "axios";
import { BASE_URL } from '@env';

const api = axios.create({
  baseURL: BASE_URL, // servidor de produção
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

// Modificando o ping para usar uma rota existente
api.ping = async () => {
  try {
    // Usando uma rota pública que sabemos que existe
    const response = await api.get('/api/pedido/1051');
    return response.status === 200;
  } catch (error) {
    console.error('Erro de conectividade:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return false;
  }
};

// Melhorando os interceptors
api.interceptors.request.use(
  config => {
    console.log('Enviando requisição:', {
      method: config.method,
      url: config.url,
      data: config.data && JSON.stringify(config.data).substring(0, 500) // Limita o tamanho do log
    });
    return config;
  },
  error => {
    console.error('Erro na requisição:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    try {
      // Limpar/validar dados antes de logar
      const cleanData = typeof response.data === 'string' 
        ? JSON.parse(response.data)
        : response.data;

      console.log('Resposta recebida:', {
        url: response.config.url,
        status: response.status,
        data: JSON.stringify(cleanData).substring(0, 500)
      });
      return response;
    } catch (error) {
      console.warn('Erro ao processar resposta:', error);
      return response;
    }
  },
  // ...existing error handler...
);

export default api;
