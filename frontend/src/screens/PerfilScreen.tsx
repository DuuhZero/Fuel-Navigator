import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
};

export default function PerfilScreen() {
  const { usuario, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  }
  return (
    <View style={styles.container}>
  <Text variant="headlineMedium" style={styles.titulo}>Perfil do Usuário</Text>
      
      {usuario && (
        <View style={styles.infoContainer}>
          <Text variant="titleMedium">Nome: {usuario.nome}</Text>
          <Text variant="bodyMedium">Email: {usuario.email}</Text>
          <Text variant="bodyMedium">
            Data de Nascimento: {usuario.dataNascimento
              ? typeof usuario.dataNascimento === 'string'
                ? usuario.dataNascimento
                : usuario.dataNascimento.toLocaleDateString()
              : 'Não informado'}
          </Text>
          <Text variant="bodyMedium">Telefone: {usuario.telefone || 'Não informado'}</Text>
        </View>
      )}

      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: '#FF9B42',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButton: {
    marginTop: 20,
  },
});