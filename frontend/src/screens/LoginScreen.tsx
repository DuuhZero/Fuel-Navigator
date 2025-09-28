import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setCarregando(true);
    try {
      await login(email, senha);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha no login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.titulo}>FuelNav</Title>
      <Text style={styles.subtitulo}>Navegação com Foco em Combustível</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={carregando}
        disabled={carregando}
        style={styles.botao}
      >
        Entrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Registro')}
        style={styles.botaoLink}
      >
        Criar nova conta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#FF9B42',
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
  },
});

export default LoginScreen;