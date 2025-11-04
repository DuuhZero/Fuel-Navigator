import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Button, TextInput, IconButton, ActivityIndicator, Card } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

type RootStackParamList = {
  Login: undefined;
};

export default function PerfilScreen() {
  const { usuario, logout, updateUsuario } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [editVisible, setEditVisible] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Estados para relatórios
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const [dados, setDados] = useState<any>(null);
  
  // Animação do toggle
  const [toggleAnim] = useState(new Animated.Value(isDark ? 1 : 0));

  useEffect(() => {
    fetchRelatorio();
  }, []);

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const fetchRelatorio = async () => {
    setCarregandoRelatorio(true);
    try {
      const response = await api.get('/relatorios/mensal');
      setDados(response.data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
    } finally {
      setCarregandoRelatorio(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

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

  const togglePosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  const toggleBgColor = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, '#FFD966'],
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.headerNome}>{usuario?.nome}</Text>
        <Text style={styles.headerEmail}>{usuario?.email}</Text>
      </LinearGradient>

      {/* Toggle Dark Mode */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <IconButton icon={isDark ? 'weather-night' : 'weather-sunny'} size={24} iconColor={colors.primary} />
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Tema</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Modo Escuro' : 'Modo Claro'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleTheme}
            style={styles.toggleContainer}
          >
            <Animated.View style={[styles.toggleTrack, { backgroundColor: toggleBgColor }]}>
              <Animated.View style={[styles.toggleThumb, { left: togglePosition }]} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Relatório Mensal Integrado */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <View style={styles.rowLeft}>
            <IconButton icon="chart-line" size={24} iconColor={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Relatório Mensal</Text>
          </View>
          <IconButton
            icon="refresh"
            size={20}
            iconColor={colors.primary}
            onPress={fetchRelatorio}
            disabled={carregandoRelatorio}
          />
        </View>

        {carregandoRelatorio ? (
          <ActivityIndicator animating size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : dados ? (
          <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <IconButton icon="map-marker-distance" size={28} iconColor={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {dados.totalDistance?.toFixed(1) || 0} km
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distância Total</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <IconButton icon="gas-station" size={28} iconColor={colors.success} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {dados.totalConsumption?.toFixed(1) || 0} L
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Consumo Total</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
              <IconButton icon="routes" size={28} iconColor={colors.warning} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {dados.numRoutes || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rotas Traçadas</Text>
            </View>

            {dados.mostUsedVehicle && (
              <View style={[styles.vehicleBox, { backgroundColor: colors.surface }]}>
                <IconButton icon="car" size={24} iconColor={colors.secondary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Veículo Mais Usado</Text>
                  <Text style={[styles.vehicleText, { color: colors.text }]}>
                    {dados.mostUsedVehicle.marca || ''} {dados.mostUsedVehicle.modelo || ''}
                  </Text>
                  <Text style={[styles.vehicleCount, { color: colors.primary }]}>
                    {dados.mostUsedVehicle.count} viagens
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <Text style={[styles.noData, { color: colors.textSecondary }]}>Nenhum dado disponível</Text>
        )}
      </View>

      {/* Ações da Conta */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setEditVisible(true)}
        >
          <IconButton icon="account-edit" size={24} iconColor={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Editar Perfil</Text>
          <IconButton icon="chevron-right" size={24} iconColor={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <IconButton icon="logout" size={24} iconColor={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Sair da Conta</Text>
          <IconButton icon="chevron-right" size={24} iconColor={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Modal de Edição */}
      <Modal visible={editVisible} animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <IconButton icon="close" size={24} onPress={() => setEditVisible(false)} iconColor={colors.text} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Perfil</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              label="Nome"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              theme={{ colors: { background: colors.surface } }}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              theme={{ colors: { background: colors.surface } }}
            />

            <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 20 }]} />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Alterar Senha</Text>

            <TextInput
              label="Senha Atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={!mostrarSenha}
              mode="outlined"
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              theme={{ colors: { background: colors.surface } }}
              right={
                <TextInput.Icon
                  icon={mostrarSenha ? 'eye-off' : 'eye'}
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
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
              theme={{ colors: { background: colors.surface } }}
              right={
                <TextInput.Icon
                  icon={mostrarSenha ? 'eye-off' : 'eye'}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                />
              }
            />

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={{ flex: 1 }}
                buttonColor={colors.primary}
              >
                Salvar
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setEditVisible(false);
                  setSenhaAtual('');
                  setNovaSenha('');
                }}
                style={{ flex: 1, borderColor: colors.border }}
                textColor={colors.text}
              >
                Cancelar
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  headerNome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  toggleContainer: {
    padding: 4,
  },
  toggleTrack: {
    width: 64,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsContainer: {
    gap: 12,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  vehicleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  vehicleText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  vehicleCount: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 48,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});