import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Backend local na porta 5000 (acessível pelo IP da sua máquina na mesma rede do celular)
// Exemplo: http://SEU-IP-LAN:5000/api
const API_BASE_URL = 'http://192.168.137.116:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erro ao obter token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('usuario');
      } catch (storageError) {
        console.error('Erro ao limpar storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

console.log('API Base URL:', API_BASE_URL);

export default api;