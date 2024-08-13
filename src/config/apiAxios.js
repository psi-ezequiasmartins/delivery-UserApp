/**
 * src/config/apiAxios.js
 */

import axios from "axios";

const URL = "https://srv.deliverybairro.com"; // (produção) // 'http://192.168.0.9:3333'; // (desenvolvimento) //

const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
})

export default api;
