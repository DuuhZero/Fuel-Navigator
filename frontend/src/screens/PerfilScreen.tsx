import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
};

export default function PerfilScreen() {
  const { usuario, logout, updateUsuario } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [editVisible, setEditVisible] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  }

  const handleSave = async () => {
    try {
      const updates: any = { nome, email };
      
      if (novaSenha) {
        if (!senhaAtual) {
          Alert.alert('Erro', 'Senha atual é necessária para alterar a senha');
          return;
        }
        updates.currentPassword = senhaAtual;
        updates.newPassword = novaSenha;
      }

      await updateUsuario(updates);
      if (novaSenha) {
        // Força reautenticação para invalidar o uso da senha antiga
        Alert.alert('Senha alterada', 'Faça login novamente com a nova senha.');
        await logout();
        navigation.navigate('Login');
        return;
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado');
      }
      setEditVisible(false);
      setSenhaAtual('');
      setNovaSenha('');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao atualizar perfil');
    }
  };
  return (
    <View style={styles.container}>
  <Text variant="headlineMedium" style={styles.titulo}>Perfil do Usuário</Text>
      
      {usuario && (
        <View style={styles.infoContainer}>
          <Text variant="titleMedium">Nome: {usuario.nome}</Text>
          <Text variant="bodyMedium">Email: {usuario.email}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button mode="contained" onPress={() => setEditVisible(true)} style={{ flex: 1 }}>Editar Perfil</Button>
        <Button mode="outlined" onPress={handleLogout} style={{ flex: 1 }}>Sair</Button>
      </View>

      <Modal visible={editVisible} animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
          <Text variant="titleLarge" style={{ marginBottom: 12 }}>Editar Perfil</Text>
          
          <TextInput 
            label="Nome" 
            value={nome} 
            onChangeText={setNome} 
            mode="outlined" 
            style={{ marginBottom: 12 }} 
          />
          
          <TextInput 
            label="Email" 
            value={email} 
            onChangeText={setEmail} 
            mode="outlined" 
            style={{ marginBottom: 12 }} 
          />

          <View style={styles.divider} />
          
          <Text variant="titleMedium" style={{ marginVertical: 8 }}>Alterar Senha</Text>
          
          <TextInput 
            label="Senha Atual"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry={!mostrarSenha}
            mode="outlined"
            style={{ marginBottom: 12 }}
            right={
              <TextInput.Icon 
                icon={mostrarSenha ? "eye-off" : "eye"} 
                onPress={() => setMostrarSenha(!mostrarSenha)}
              />
            }
          />
          
          <TextInput 
            label="Nova Senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={!mostrarSenha}
            mode="outlined"
            style={{ marginBottom: 12 }}
            right={
              <TextInput.Icon 
                icon={mostrarSenha ? "eye-off" : "eye"} 
                onPress={() => setMostrarSenha(!mostrarSenha)}
              />
            }
          />
          
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button mode="contained" onPress={handleSave} style={{ flex: 1 }}>
              Salvar
            </Button>
            <Button mode="outlined" onPress={() => {
              setEditVisible(false);
              setSenhaAtual('');
              setNovaSenha('');
            }} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});