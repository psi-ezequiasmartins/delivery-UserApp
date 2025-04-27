/**
 * src/config/apiAxios.js
 */

import axios from "axios";
import { BASE_URL, NODE_ENV } from '@env';

const isDevelopment = NODE_ENV; // Verifica se o ambiente é de desenvolvimento ou produção
  
if (isDevelopment === 'development') {  
  console.log('Ambiente de desenvolvimento detectado. Habilitando logs detalhados.');
}

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
    const response = await api.get('/api/listar/deliveries');
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

// Interceptores de requisição
api.interceptors.request.use(
  config => {
    if (isDevelopment && config.data !== undefined) {
      console.log('Enviando requisição:', {
        method: config.method,
        url: config.url,
        data: config.data && JSON.stringify(config.data).substring(0, 500) // Limita o tamanho do log
      });
    }
    return config;
  },
  error => {
    console.error('Erro na requisição:', error.message); // Mantenha logs de erro
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (isDevelopment) {
      try {
        const cleanData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        if (cleanData !== null) {
          console.log('Resposta recebida:', {
            url: response.config.url,
            status: response.status,
            data: JSON.stringify(cleanData).substring(0, 500)
          });
        }
      } catch (error) {
        console.warn('Erro ao processar resposta:', error);
      }
    }
    return response;
  },
  error => {
    console.error('Erro na resposta:', error.message); // Mantenha logs de erro
    return Promise.reject(error);
  }
);

export default api;
