import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Usuario } from '../types';

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsuario: (updates: Partial<Usuario>) => Promise<void>;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const tokenStorage = await AsyncStorage.getItem('token');
      const usuarioStorage = await AsyncStorage.getItem('usuario');
      
      if (tokenStorage && usuarioStorage) {
        setToken(tokenStorage);
        setUsuario(JSON.parse(usuarioStorage));
        api.defaults.headers.Authorization = `Bearer ${tokenStorage}`;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: newToken, usuario: newUsuario } = response.data;
      
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('usuario', JSON.stringify(newUsuario));
      
      setToken(newToken);
      setUsuario(newUsuario);
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const updateUsuario = async (updates: Partial<Usuario>) => {
    try {
      const response = await api.put('/usuarios', updates);
      const updated = response.data;
      setUsuario(updated);
      await AsyncStorage.setItem('usuario', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      setToken(null);
      setUsuario(null);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, updateUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};