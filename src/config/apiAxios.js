/**
 * src/config/apiAxios.js
 */

import axios from "axios";

const URL = 'http://localhost:3359'; // "https://srv.deliverybairro.com"; // 

const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
})

export default api;
