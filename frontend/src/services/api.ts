import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// URL fixa do backend na Vercel - funciona em qualquer WiFi/4G
const API_BASE_URL = 'https://backend-fuelnav-avwo3xgmp-eduardo-da-silva-fontes-projects.vercel.app/api';

console.log('🌐 Backend na Vercel (cloud)');
console.log('🚀 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado para 15s por causa da latência da Vercel
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
  (response) => {
    return response;
  },
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