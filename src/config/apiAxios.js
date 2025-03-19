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
})

export default api;
