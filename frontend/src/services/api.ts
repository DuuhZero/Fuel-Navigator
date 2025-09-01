import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Função para determinar a URL base automaticamente
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Para dispositivo físico - use o IP da sua máquina
    return 'http://192.168.15.12:5000/api'; // ⚠️ SUBSTITUA pelo seu IP!
  }
  return 'https://seu-backend-producao.com/api';
};
const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token às requisições
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

// Interceptor para tratar erros de autenticação
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

// Função para debug - mostrando a URL base
console.log('API Base URL:', API_BASE_URL);

export default api;