
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';
import { Veiculo } from '../types';

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
  const [veiculosMap, setVeiculosMap] = useState<Record<string, Pick<Veiculo, 'marca' | 'modelo' | 'placa'>>>({});

  const carregarVeiculos = async () => {
    try {
      const resp = await api.get('/veiculos');
      const lista: Veiculo[] = resp.data || [];
      const map: Record<string, Pick<Veiculo, 'marca' | 'modelo' | 'placa'>> = {};
      lista.forEach(v => {
        if ((v as any)._id) {
          map[(v as any)._id] = { marca: v.marca, modelo: v.modelo, placa: v.placa };
        }
      });
      setVeiculosMap(map);
    } catch (e) {
      // silencioso: se falhar, apenas não enriquece a exibição
    }
  };

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
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      Alert.alert('Erro', error?.response?.data?.message || 'Falha ao carregar histórico');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarVeiculos();
    fetchHistorico();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarVeiculos();
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

    // Resolver infos do veículo: usar populate, senão buscar no mapa por id
    let veiculoTexto = 'Veículo';
    const veiculoField: any = (item as any).veiculoId;
    if (veiculoField && typeof veiculoField === 'object' && ('marca' in veiculoField || 'modelo' in veiculoField)) {
      const marca = veiculoField.marca || '';
      const modelo = veiculoField.modelo || '';
      const placa = veiculoField.placa ? `(${veiculoField.placa})` : '';
      veiculoTexto = `${marca || 'Veículo'} ${modelo || ''} ${placa}`.trim();
    } else if (veiculoField && typeof veiculoField === 'string') {
      const v = veiculosMap[veiculoField];
      if (v) {
        const placa = v.placa ? `(${v.placa})` : '';
        veiculoTexto = `${v.marca || 'Veículo'} ${v.modelo || ''} ${placa}`.trim();
      }
    }
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.tituloCard}>📍 {origemEndereco} → {destinoEndereco}</Text>
          <Text style={styles.info}>Veículo: {veiculoTexto}</Text>
          <Text style={styles.info}>Distância: {distancia ? distancia.toFixed(1) : '-'} km</Text>
          <Text style={styles.info}>Consumo: {item.consumoEstimado !== undefined ? item.consumoEstimado.toFixed(2) : '-'} L</Text>
          {item.dataViagem && <Text style={styles.info}>Data: {formatarData(item.dataViagem)}</Text>}
        </Card.Content>
      </Card>
    );
  }, [enderecos, veiculosMap]);

  return (
    <View style={styles.container}>
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