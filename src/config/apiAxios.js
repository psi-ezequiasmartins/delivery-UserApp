/**
 * src/config/apiAxios.js
 */

import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, NODE_ENV } from '@env';

const isDevelopment = NODE_ENV === 'development';
  
if (isDevelopment) {
  console.log('Ambiente de desenvolvimento detectado. Habilitando logs detalhados.');
  console.log('URL base do servidor:', BASE_URL);
}

API_URL = BASE_URL || 'http://localhost:3357' || 'https://srv.deliverybairro.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
});

api.ping = async () => {
  try {
    const response = await api.get('/api/ping');
    console.log('Conexão com o servidor:', { data: response.data });
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Acesso não autorizado à rota /api/ping. Verifique a autenticação.');
    } else {
      console.error('Erro de conectividade:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return false;
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    if (isDevelopment) {
      try {
        const cleanData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        if (cleanData !== null) {
          if (isDevelopment && response.data !== undefined) {
            console.log('Recebendo resposta...');
          }
          if (response.status === 200) {
            console.log('Resposta bem-sucedida');
          } else {
            console.warn('Resposta com erro:', {
              url: response.config.url,
              status: response.status,
              data: JSON.stringify(cleanData).substring(0, 500)
            });
          }
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
  }, error => {
    console.error('Erro na resposta:', error.message); // Mantenha logs de erro
    return Promise.reject(error);
  }
);

export default api;
