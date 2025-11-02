import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';

export default function RelatoriosScreen() {
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState<any>(null);

  const fetchRelatorio = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/relatorios/mensal');
      setDados(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchRelatorio();
  }, []);

  const downloadPDF = async () => {
    try {
      setCarregando(true);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const url = `${api.defaults.baseURL}/relatorios/pdf?token=${token}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        Alert.alert('Sucesso', 'O download do relatório foi iniciado no seu navegador');
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o navegador para download');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao abrir URL:', errorMsg);
      Alert.alert('Erro', 'Falha ao iniciar o download do relatório');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineMedium" style={styles.titulo}>Relatório Mensal</Text>

      {carregando && <ActivityIndicator animating size="large" />}

      {dados && (
        <Card style={{ marginVertical: 12, padding: 12 }}>
          <Text>Distância total (30 dias): {dados.totalDistance?.toFixed(2) ?? 0} km</Text>
          <Text>Consumo total estimado: {dados.totalConsumption?.toFixed(2) ?? 0} L</Text>
          <Text>Número de rotas traçadas: {dados.numRoutes ?? 0}</Text>
          <Text>Veículo mais utilizado: {dados.mostUsedVehicle ? `${dados.mostUsedVehicle.marca || ''} ${dados.mostUsedVehicle.modelo || ''} (usos: ${dados.mostUsedVehicle.count})` : '-'}</Text>
        </Card>
      )}

      <Button 
        mode="contained" 
        onPress={downloadPDF} 
        style={{ marginTop: 8 }}
        loading={carregando}
        disabled={carregando}
      >
        {carregando ? 'Baixando...' : 'Baixar Relatório'}
      </Button>
      <Button mode="outlined" onPress={fetchRelatorio} style={{ marginTop: 8 }}>Atualizar</Button>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titulo: {
    color: '#FF9B42',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  }
})
