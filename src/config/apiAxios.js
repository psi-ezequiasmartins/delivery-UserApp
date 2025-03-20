/**
 * src/config/apiAxios.js
 */

import axios from "axios";

const URL = "https://srv.deliverybairro.com"; // 'http://192.168.0.210:3359'; // 

const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Adicione estes interceptors após a criação da instância api
api.interceptors.request.use(
  config => {
      console.log('API Request:', {
          method: config.method,
          url: config.url,
          data: config.data,
          headers: config.headers
      });
      return config;
  },
  error => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
      console.log('API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
      });
      return response;
  },
  error => {
      console.error('API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
      });
      return Promise.reject(error);
  }
);

export default api;
