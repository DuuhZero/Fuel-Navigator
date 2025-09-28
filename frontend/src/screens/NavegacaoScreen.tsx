import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Alert, Dimensions, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons, ActivityIndicator, IconButton } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { Veiculo, Coordenada } from '../types';
import api from '../services/api';
import OpenRouteMap from '../components/OpenRouteMap';
import { useLocation } from '../hooks/useLocation';
const { height } = Dimensions.get('window');

interface CalculoRota {
  distancia: number;
  duracao: number;
  consumoEstimado: number;
  custoEstimado?: number;
  coordenadas: Coordenada[];
  origem: string;
  destino: string;
}

const NavegacaoScreen: React.FC = () => {

  const salvarRota = async () => {
    if (!rota || !veiculoSelecionado) return;
    try {
      await api.post('/rotas', {
        veiculoId: veiculoSelecionado._id,
        distancia: rota.distancia,
        duracao: rota.duracao,
        consumoEstimado: rota.consumoEstimado,
        custoEstimado: rota.custoEstimado,
        precoCombustivel: precoCombustivel ? parseFloat(precoCombustivel) : undefined,
        origem: rota.origem,
        destino: rota.destino,
        coordenadas: rota.coordenadas
      });
      Alert.alert('Sucesso', 'Rota salva para uso offline!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar rota');
    }
  };
  useAuth();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [precoCombustivel, setPrecoCombustivel] = useState('');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [rota, setRota] = useState<CalculoRota | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const resultadoAnim = useRef(new Animated.Value(0)).current;
  const [mostrarSeletorVeiculo, setMostrarSeletorVeiculo] = useState(false);
  const { location } = useLocation();
  const [enderecoAtual, setEnderecoAtual] = useState('');

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      setEnderecoAtual(`${latitude}, ${longitude}`);
    }
  }, [location]);


  useEffect(() => {
    carregarVeiculos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarVeiculos();
    }, [])
  );



  useEffect(() => {
    if (rota && rota.coordenadas && rota.coordenadas.length > 0) {
      console.log('Rota disponível para exibição:', rota.coordenadas.length, 'pontos');
      setMostrarResultado(true);
      Animated.timing(resultadoAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (rota) {
      console.log('Rota sem coordenadas válidas');
    }
  }, [rota]);


  const carregarVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
      if (response.data.length > 0) {
        setVeiculoSelecionado(response.data[0]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar veículos');
    }
  };

 

  const fecharResultado = () => {
    Animated.timing(resultadoAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMostrarResultado(false);
    });
  };

  const obterLocalizacaoAtual = async () => {
    if (location && location.coords) {
      const { latitude, longitude } = location.coords;
      setEnderecoAtual(`Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      setOrigem(`Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } else {
      Alert.alert('Erro', 'Não foi possível obter a localização atual');
    }
  };

  const calcularRota = async () => {
    if (!destino || !veiculoSelecionado) {
      Alert.alert('Erro', 'Preencha o destino e selecione um veículo');
      return;
    }

    setCarregando(true);
    try {
      let origemParaCalcular = origem && origem.trim() !== '' ? origem : enderecoAtual;
      if (!origemParaCalcular || origemParaCalcular.trim() === '') {
        if (location && location.coords) {
          origemParaCalcular = `Localização: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
          setOrigem(origemParaCalcular);
        }
      }

      const response = await api.post('/rotas/calcular', {
        origem: origemParaCalcular,
        destino,
        veiculoId: veiculoSelecionado._id,
        precoCombustivel: precoCombustivel ? parseFloat(precoCombustivel) : undefined
      });

      setRota(response.data);
      setMostrarResultado(true); 

      try {
        await api.post('/historico', {
          veiculoId: veiculoSelecionado._id,
          distancia: response.data.distancia,
          duracao: response.data.duracao,
          consumoEstimado: response.data.consumoEstimado,
          custoEstimado: response.data.custoEstimado,
          precoCombustivel: precoCombustivel ? parseFloat(precoCombustivel) : undefined,
          origem: response.data.origem,
          destino: response.data.destino,
          coordenadas: response.data.coordenadas
        });
      } catch (err) {
        Alert.alert('Atenção', 'Falha ao salvar histórico, mas a rota foi calculada. Você pode tentar salvar manualmente.');
        setMostrarResultado(false);
      }

    } catch (error: any) {
      setMostrarResultado(false);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao calcular rota');
    } finally {
      setCarregando(false);
    }
  };



  const salvarHistorico = async () => {
    if (!rota || !veiculoSelecionado) return;

    try {
      await api.post('/historico', {
        veiculoId: veiculoSelecionado._id,
        distancia: rota.distancia,
        duracao: rota.duracao,
        consumoEstimado: rota.consumoEstimado,
        custoEstimado: rota.custoEstimado,
        precoCombustivel: precoCombustivel ? parseFloat(precoCombustivel) : undefined,
        origem: rota.origem,
        destino: rota.destino
      });
      Alert.alert('Sucesso', 'Viagem salva no histórico');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar histórico');
    }
  };

  const limparRota = () => {
    setRota(null);
    setDestino('');
    setOrigem('');
    setMostrarResultado(false);
  };


  const resultadoTranslateY = resultadoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0] 
  });

  return (
    <View style={styles.container}>
      {/* Mapa do OpenRoute Service */}
      <OpenRouteMap
        coordenadas={rota?.coordenadas || (location ? [{ latitude: location.coords.latitude, longitude: location.coords.longitude }] : [])}
        origem={rota?.origem || enderecoAtual || 'Sua localização'}
        destino={rota?.destino || ''}
        altura={height}
      />

      {/* Interface única de busca de rota */}
      {!mostrarResultado && (
        <View style={styles.menuBuscaContainer}>
          <Text style={styles.tituloBusca}>Calcular rota</Text>
          <TextInput
            label="Origem"
            value={origem}
            onChangeText={setOrigem}
            placeholder="Origem (deixe vazio para usar localização atual)"
            style={styles.inputBusca}
          />
          <TextInput
            label="Destino"
            value={destino}
            onChangeText={setDestino}
            placeholder="Destino"
            style={styles.inputBusca}
          />
          <TextInput
            label="Preço do combustível (opcional)"
            value={precoCombustivel}
            onChangeText={setPrecoCombustivel}
            keyboardType="numeric"
            style={styles.inputBusca}
            placeholder="Ex: 5.50"
          />
          {veiculos.length > 0 && (
            <View style={styles.seletorVeiculoContainer}>
              <Text style={styles.label}>Veículo</Text>
              <Button
                mode="outlined"
                style={styles.seletorVeiculoBotao}
                onPress={() => setMostrarSeletorVeiculo(true)}
              >
                {veiculoSelecionado ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}` : 'Selecionar veículo'}
              </Button>
              {/* Modal de seleção de veículo */}
              {mostrarSeletorVeiculo && (
                <View style={styles.modalSeletorVeiculo}>
                  {veiculos.map((veiculo) => (
                    <Button
                      key={veiculo._id}
                      mode={veiculoSelecionado?._id === veiculo._id ? 'contained' : 'outlined'}
                      style={styles.seletorVeiculoItem}
                      onPress={() => {
                        setVeiculoSelecionado(veiculo);
                        setMostrarSeletorVeiculo(false);
                      }}
                    >
                      {veiculo.marca} {veiculo.modelo}
                    </Button>
                  ))}
                  <Button mode="text" onPress={() => setMostrarSeletorVeiculo(false)} style={{ marginTop: 8 }}>Cancelar</Button>
                </View>
              )}
            </View>
          )}
          <Button mode="contained" onPress={calcularRota} style={styles.botaoBusca} loading={carregando} disabled={carregando} icon="routes">
            {carregando ? 'Calculando...' : 'Calcular Rota'}
          </Button>
        </View>
      )}

      {/* Overlay de Resultados */}
      {mostrarResultado && rota && (
        <Animated.View
          style={[styles.resultadoOverlay, { transform: [{ translateY: resultadoTranslateY }] }]}
        >
          <Card style={styles.resultadoCard}>
            <Card.Content>
              <View style={styles.resultadoHeader}>
                <Text variant="titleMedium" style={styles.tituloResultado}>
                  📍 {rota.origem || '-'} → {rota.destino || '-'}
                </Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={fecharResultado}
                  style={styles.fecharResultado}
                />
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Distância</Text>
                  <Text style={styles.infoValue}>{typeof rota.distancia === 'number' ? rota.distancia.toFixed(1) : '-'} km</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tempo</Text>
                  <Text style={styles.infoValue}>{typeof rota.duracao === 'number' ? Math.round(rota.duracao) : '-'} min</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Consumo</Text>
                  <Text style={styles.infoValue}>{typeof rota.consumoEstimado === 'number' ? rota.consumoEstimado.toFixed(1) : '-'} L</Text>
                </View>

                {typeof rota.custoEstimado === 'number' && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Custo</Text>
                    <Text style={styles.infoValue}>R$ {rota.custoEstimado.toFixed(2)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.botoesContainer}>
                <Button
                  mode="outlined"
                  onPress={salvarRota}
                  style={styles.botaoResultado}
                  icon="content-save"
                  compact
                >
                  Salvar Rota
                </Button>
                <Button
                  mode="outlined"
                  onPress={limparRota}
                  style={styles.botaoResultado}
                  icon="refresh"
                  compact
                >
                  Nova Rota
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setRota({ ...rota })}
                  style={styles.botaoResultado}
                  icon="map"
                  compact
                >
                  Recarregar Mapa
                </Button>
              </View>
              <Button
                mode="text"
                style={{ marginTop: 16 }}
                icon="chevron-up"
                onPress={() => setMostrarResultado(false)}
              >
                Buscar nova rota
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      )}

      {carregando && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Calculando melhor rota...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuBuscaContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloBusca: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9B42',
    marginBottom: 12,
  },
  inputBusca: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  botaoBusca: {
    backgroundColor: '#FF9B42',
    marginTop: 8,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  resultadoOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  resultadoCard: {
    borderRadius: 16,
    padding: 7,
  },
  resultadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tituloResultado: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    color: '#2c3e50',
  },
  fecharResultado: {
    margin: 0,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5500c4ff',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4
  },
  botaoResultado: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute', 
    left: '45%',
    transform: [{ translateX: -70 }],
    zIndex: 25,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: {
    margin: 0,
    marginRight: 8,
  },
  toggleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  seletorVeiculoContainer: {
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  seletorVeiculoBotao: {
    width: '100%',
    marginBottom: 4,
    alignSelf: 'stretch',
    minWidth: '100%',
    maxWidth: '100%',
  },
  modalSeletorVeiculo: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 8,
    zIndex: 100,
    padding: 12,
    alignItems: 'center',
  },
  seletorVeiculoItem: {
    width: '100%',
    marginBottom: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});

export default NavegacaoScreen;