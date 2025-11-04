import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
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
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { colors } = useTheme();

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

    if (formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/registrar', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header com gradiente */}
          <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IconButton icon="arrow-left" size={24} iconColor="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <IconButton icon="account-plus" size={60} iconColor="#1A1A1A" />
            </View>
            <Text style={styles.titulo}>Criar Conta</Text>
            <Text style={styles.subtitulo}>Comece sua jornada econômica</Text>
          </LinearGradient>

          {/* Card de Registro */}
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Dados Pessoais</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              * Campos obrigatórios
            </Text>

            <TextInput
              label="Nome Completo *"
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              left={<TextInput.Icon icon="account" />}
              theme={{ colors: { background: colors.surface } }}
            />

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              left={<TextInput.Icon icon="email" />}
              theme={{ colors: { background: colors.surface } }}
            />

            <TextInput
              label="Senha *"
              value={formData.senha}
              onChangeText={(value) => handleChange('senha', value)}
              secureTextEntry={!mostrarSenha}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={mostrarSenha ? 'eye-off' : 'eye'}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                />
              }
              theme={{ colors: { background: colors.surface } }}
            />

            <TextInput
              label="Confirmar Senha *"
              value={formData.confirmarSenha}
              onChangeText={(value) => handleChange('confirmarSenha', value)}
              secureTextEntry={!mostrarSenha}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={mostrarSenha ? 'eye-off' : 'eye'}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                />
              }
              theme={{ colors: { background: colors.surface } }}
            />

            <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
              <IconButton icon="information" size={20} iconColor={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                A senha deve ter pelo menos 6 caracteres
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleRegistro}
              loading={carregando}
              disabled={carregando}
              style={[styles.botao, { backgroundColor: colors.primary }]}
              labelStyle={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 }}
            >
              {carregando ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.linkButton, { borderColor: colors.border }]}
            >
              <Text style={[styles.linkText, { color: colors.text }]}>
                Já tem uma conta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Faça login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 48,
    zIndex: 10,
  },
  iconContainer: {
    marginBottom: 12,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(26, 26, 26, 0.8)',
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    marginLeft: -4,
  },
  botao: {
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  linkButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});

export default RegistroScreen;