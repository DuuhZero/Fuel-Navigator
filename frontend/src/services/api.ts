import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


// Sempre usar backend em nuvem para garantir acesso pelo Expo Go
const API_BASE_URL = 'https://backend-fuelnav.vercel.app/api';

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