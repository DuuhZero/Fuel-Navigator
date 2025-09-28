import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, FAB, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Veiculos: undefined;
  EditarVeiculo: { veiculo: Veiculo };
  AdicionarVeiculo: undefined;
};

import { Veiculo } from '../types';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function VeiculosScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { usuario } = useAuth();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarVeiculos();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar veículos');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você TEM certeza que deseja excluir este veículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/veiculos/${id}`);
              carregarVeiculos();
              Alert.alert('Sucesso', 'Veículo excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir veículo');
            }
          }
        }
      ]
    );
  };

  const handleEditar = (veiculo: Veiculo) => {
    navigation.navigate('EditarVeiculo', { veiculo });
  };
  const handleAdicionar = () => {

    navigation.navigate('AdicionarVeiculo');
  };

  const renderVeiculo = ({ item }: { item: Veiculo }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.marca} {item.modelo}</Text>
        <Text variant="bodyMedium">Ano: {item.ano}</Text>
        <Text variant="bodyMedium">Consumo: {item.consumoMedio} km/L</Text>
        <Text variant="bodyMedium">Combustível: {item.tipoCombustivel}</Text>
        <Text variant="bodyMedium">Placa: {item.placa || 'N/A'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEditar(item)}>Editar</Button>
        <Button onPress={() => handleExcluir(item._id)} textColor="#ffffffff">
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {veiculos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">Nenhum veículo cadastrado</Text>
          <Text style={styles.emptyText}>
            Clique no botão + para adicionar seu primeiro veículo
          </Text>
        </View>
      ) : (
        <FlatList
          data={veiculos}
          renderItem={renderVeiculo}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
      
      <FAB
      
        style={styles.fab}
        icon="plus"
        onPress={handleAdicionar}
        label="Adicionar Veículo"
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#bbbbbbff',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF9B42',

  },
});