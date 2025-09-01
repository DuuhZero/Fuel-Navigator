import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Main: undefined;
};

type RegistroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registro'>;

interface Props {
  navigation: RegistroScreenNavigationProp;
}

const RegistroScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '',
  });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegistro = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/registrar', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone || undefined,
        dataNascimento: formData.dataNascimento || undefined,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.titulo}>Criar Conta</Title>
      <Text style={styles.subtitulo}>Preencha os dados para se registrar</Text>
      
      <TextInput
        label="Nome Completo *"
        value={formData.nome}
        onChangeText={(value) => handleChange('nome', value)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Email *"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Senha *"
        value={formData.senha}
        onChangeText={(value) => handleChange('senha', value)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Confirmar Senha *"
        value={formData.confirmarSenha}
        onChangeText={(value) => handleChange('confirmarSenha', value)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Telefone (opcional)"
        value={formData.telefone}
        onChangeText={(value) => handleChange('telefone', value)}
        keyboardType="phone-pad"
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Data de Nascimento (opcional)"
        value={formData.dataNascimento}
        onChangeText={(value) => handleChange('dataNascimento', value)}
        placeholder="DD/MM/AAAA"
        style={styles.input}
        mode="outlined"
      />
      
      <Button
        mode="contained"
        onPress={handleRegistro}
        loading={carregando}
        disabled={carregando}
        style={styles.botao}
      >
        Criar Conta
      </Button>
      
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.botaoLink}
      >
        Já tem uma conta? Faça login
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    marginTop:50,
    color: '#3B82F6',
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  botao: {
    marginTop: 20,
    padding: 8,
  },
  botaoLink: {
    marginTop: 16,
    marginBottom: 30,
  },
});

export default RegistroScreen;