
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';

interface HistoricoViagem {
  _id: string;
  veiculoId?: {
    marca?: string;
    modelo?: string;
    placa?: string;
  };
  rotaId?: {
    origemEndereco?: string;
    destinoEndereco?: string;
    distancia?: number;
    duracao?: number;
  };
  distancia?: number;
  consumoEstimado?: number;
  destino?: string;
  origem?: string;
  dataViagem?: string;
  origemEndereco?: string;
  destinoEndereco?: string;
  dadosRota?: {
    origemEndereco?: string;
    destinoEndereco?: string;
    coordenadas?: any;
  };
}

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<HistoricoViagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enderecos, setEnderecos] = useState<Record<string, { origem: string; destino: string }>>({});

  const fetchHistorico = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/historico');
      setHistorico(response.data);
      // Busca endereços para cada item
      const promises = response.data.map(async (item: HistoricoViagem) => {
        const buscarEndereco = async (coord: string) => {
          const match = coord?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
          if (match) {
            const lat = match[1];
            const lon = match[2];
            try {
              const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
              return res.data.display_name || coord;
            } catch {
              return coord;
            }
          }
          return coord;
        };
        const origem = item.origem ? await buscarEndereco(item.origem) : 'Origem não informada';
        const destino = item.destino ? await buscarEndereco(item.destino) : 'Destino não informada';
        return { id: item._id, origem, destino };
      });
      const results = await Promise.all(promises);
      const novoEnderecos: Record<string, { origem: string; destino: string }> = {};
      results.forEach(e => {
        novoEnderecos[e.id] = { origem: e.origem, destino: e.destino };
      });
      setEnderecos(novoEnderecos);
    } catch (error) {
      setHistorico([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchHistorico();
    }, [])
  );

  const formatarData = (data?: string) => {
    if (!data) return '';
    const d = new Date(data);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const renderItem = useCallback(({ item }: { item: HistoricoViagem }) => {
    const distancia = item.rotaId?.distancia || item.distancia || 0;
    // Preferir endereços geocodificados, se existirem
    const origemEndereco = item.origemEndereco || item.dadosRota?.origemEndereco || item.origem || '-';
    const destinoEndereco = item.destinoEndereco || item.dadosRota?.destinoEndereco || item.destino || '-';
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.tituloCard}>📍 {origemEndereco} → {destinoEndereco}</Text>
          <Text style={styles.info}>Veículo: {item.veiculoId?.marca || 'Veículo'} {item.veiculoId?.modelo || ''} {item.veiculoId?.placa ? `(${item.veiculoId.placa})` : ''}</Text>
          <Text style={styles.info}>Distância: {distancia ? distancia.toFixed(1) : '-'} km</Text>
          <Text style={styles.info}>Consumo: {item.consumoEstimado !== undefined ? item.consumoEstimado.toFixed(2) : '-'} L</Text>
          {item.dataViagem && <Text style={styles.info}>Data: {formatarData(item.dataViagem)}</Text>}
        </Card.Content>
      </Card>
    );
  }, [enderecos]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>Histórico de Viagens</Text>
      {carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
      ) : historico.length === 0 ? (
        <Text style={styles.text}>Nenhuma viagem realizada ainda.</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: '#FF9B42',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  tituloCard: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
});