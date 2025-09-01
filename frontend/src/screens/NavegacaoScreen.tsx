import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons, ActivityIndicator, IconButton } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { Veiculo, Coordenada } from '../types';
import api from '../services/api';
import OpenRouteMap from '../components/OpenRouteMap';
import * as Location from 'expo-location';
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
  useAuth();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [precoCombustivel, setPrecoCombustivel] = useState('');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [rota, setRota] = useState<CalculoRota | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [painelAberto, setPainelAberto] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const resultadoAnim = useRef(new Animated.Value(0)).current;
  const [localizacaoAtual, setLocalizacaoAtual] = useState<Coordenada | null>(null);
  const [enderecoAtual, setEnderecoAtual] = useState('');

  useEffect(() => {
    const inicializar = async () => {
      await obterLocalizacaoAtual();
      await carregarVeiculos();
    };
    inicializar();
  }, []);


  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: painelAberto ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [painelAberto]);

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

  const togglePainel = () => {
    setPainelAberto(!painelAberto);
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
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão de localização é necessária');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const { latitude, longitude } = location.coords;

      setLocalizacaoAtual({ latitude, longitude });

      try {
        // Geocodificar para obter endereço
        let [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });

        let enderecoFormatado = 'Sua localização atual';
        if (address) {
          const parts = [
            address.street,
            address.name,
            address.district,
            address.city,
            address.region
          ].filter(part => part && part.trim() !== '');

          enderecoFormatado = parts.join(', ');
        }

        setEnderecoAtual(enderecoFormatado);
        setOrigem(enderecoFormatado);

      } catch (geocodeError) {
        console.warn('Erro no geocoding reverso:', geocodeError);
        setEnderecoAtual(`Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setOrigem(`Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }

    } catch (error) {
      console.error('Erro ao obter localização:', error);
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
      // Se não tem origem específica, usa a localização atual
      const origemParaCalcular = origem || enderecoAtual;

      const response = await api.post('/rotas/calcular', {
        origem: origemParaCalcular,
        destino,
        veiculoId: veiculoSelecionado._id,
        precoCombustivel: precoCombustivel ? parseFloat(precoCombustivel) : undefined
      });

      setRota(response.data);
      togglePainel();

    } catch (error: any) {
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

  const painelTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0]
  });

  const resultadoTranslateY = resultadoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0] // Agora vem de cima
  });

  return (
    <View style={styles.container}>
      {/* Mapa do OpenRoute Service */}
      <OpenRouteMap
        coordenadas={rota?.coordenadas || (localizacaoAtual ? [localizacaoAtual] : [])}
        origem={rota?.origem || enderecoAtual || 'Sua localização'}
        destino={rota?.destino || ''}
        altura={height}
      />

      {/* Overlay de Resultados */}
      {mostrarResultado && rota && (
        <Animated.View
          style={[
            styles.resultadoOverlay,
            { transform: [{ translateY: resultadoTranslateY }] }
          ]}
        >
          <Card style={styles.resultadoCard}>
            <Card.Content>
              <View style={styles.resultadoHeader}>
                <Text variant="titleMedium" style={styles.tituloResultado}>
                  📍 {rota.origem} → {rota.destino}
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
                  <Text style={styles.infoValue}>{rota.distancia.toFixed(1)} km</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tempo</Text>
                  <Text style={styles.infoValue}>{Math.round(rota.duracao)} min</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Consumo</Text>
                  <Text style={styles.infoValue}>{rota.consumoEstimado.toFixed(1)} L</Text>
                </View>

                {rota.custoEstimado && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Custo</Text>
                    <Text style={styles.infoValue}>R$ {rota.custoEstimado.toFixed(2)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.botoesContainer}>
                <Button
                  mode="outlined"
                  onPress={salvarHistorico}
                  style={styles.botaoResultado}
                  icon="content-save"
                  compact
                >
                  Salvar
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
            </Card.Content>
          </Card>
        </Animated.View>
      )}

      {/* Painel deslizante */}
      <Animated.View
        style={[
          styles.painelContainer,
          { transform: [{ translateY: painelTranslateY }] }
        ]}
      >
        {/* Toggle Button preso no topo do painel */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={togglePainel}
          activeOpacity={0.8}
        >
          <View style={styles.toggleButtonContent}>
            <IconButton
              icon={painelAberto ? "chevron-down" : "routes"}
              size={24}
              iconColor="#FFF"
              style={styles.toggleIcon}
            />
            <Text style={styles.toggleButtonText}>
              {painelAberto ? 'Fechar Busca' : 'Calcular Rota'}
            </Text>
          </View>
        </TouchableOpacity>

        <ScrollView style={styles.painelContent}>
          <Card style={styles.controlesCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.tituloPainel}>
                Calcular Rota
              </Text>

              <TextInput
                label="Origem"
                value={origem}
                onChangeText={setOrigem}
                style={styles.input}
                mode="outlined"
                placeholder="Ex: São Paulo, SP"
              />

              <TextInput
                label="Destino"
                value={destino}
                onChangeText={setDestino}
                style={styles.input}
                mode="outlined"
                placeholder="Ex: Campinas, SP"
              />

              <TextInput
                label="Preço do combustível (opcional)"
                value={precoCombustivel}
                onChangeText={setPrecoCombustivel}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                placeholder="Ex: 5.50"
              />

              {veiculos.length > 0 && (
                <>
                  <Text style={styles.label}>Selecionar Veículo</Text>
                  <SegmentedButtons
                    value={veiculoSelecionado?._id || ''}
                    onValueChange={(value: string) => setVeiculoSelecionado(veiculos.find(v => v._id === value) || null)}
                    buttons={veiculos.map(veiculo => ({
                      value: veiculo._id,
                      label: `${veiculo.marca} ${veiculo.modelo}`
                    }))}
                    style={styles.segmented}
                  />
                </>
              )}

              <Button
                mode="contained"
                onPress={calcularRota}
                style={styles.botao}
                loading={carregando}
                disabled={carregando}
                icon="routes"
              >
                {carregando ? 'Calculando...' : 'Calcular Rota'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </Animated.View>

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
  painelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    zIndex: 15,
    minHeight: 320,
    maxHeight: height * 0.7,
    overflow: 'hidden',
  },
  painelContent: {
    padding: 16,
    paddingTop: 40, // Espaço para o toggle button
    maxHeight: height * 0.7,
  },
  controlesCard: {
    borderRadius: 16,
    elevation: 2,
    padding: 8,
    marginTop: 10,
  },
  tituloPainel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  segmented: {
    marginBottom: 16,
  },
  botao: {
    marginTop: 8,
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