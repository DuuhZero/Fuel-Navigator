import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function AdicionarVeiculoScreen() {
  const navigation = useNavigation();
  const { usuario } = useAuth();
  
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    consumoMedio: '',
    tipoCombustivel: 'gasolina' as 'gasolina' | 'etanol' | 'diesel' | 'flex',
    capacidadeTanque: '',
    cor: ''
  });
  
  const [carregando, setCarregando] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.marca || !formData.modelo || !formData.ano || !formData.consumoMedio) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios: marca, modelo, ano e consumo médio');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/veiculos', {
        ...formData,
        ano: parseInt(formData.ano),
        consumoMedio: parseFloat(formData.consumoMedio),
        capacidadeTanque: formData.capacidadeTanque ? parseFloat(formData.capacidadeTanque) : undefined
      });

      Alert.alert('Sucesso', 'Veículo adicionado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao adicionar veículo');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.titulo}>Adicionar Veículo</Text>

          <TextInput
            label="Marca *"
            value={formData.marca}
            onChangeText={(value) => handleChange('marca', value)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Modelo *"
            value={formData.modelo}
            onChangeText={(value) => handleChange('modelo', value)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Ano *"
            value={formData.ano}
            onChangeText={(value) => handleChange('ano', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Placa"
            value={formData.placa}
            onChangeText={(value) => handleChange('placa', value)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Consumo Médio (km/L) *"
            value={formData.consumoMedio}
            onChangeText={(value) => handleChange('consumoMedio', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <Text style={styles.label}>Tipo de Combustível *</Text>
          <SegmentedButtons
            value={formData.tipoCombustivel}
            onValueChange={(value) => handleChange('tipoCombustivel', value as any)}
            buttons={[
              { value: 'gasolina', label: 'Gasolina' },
              { value: 'etanol', label: 'Etanol' },
              { value: 'diesel', label: 'Diesel' },
              { value: 'flex', label: 'Flex' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            label="Capacidade do Tanque (L)"
            value={formData.capacidadeTanque}
            onChangeText={(value) => handleChange('capacidadeTanque', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Cor"
            value={formData.cor}
            onChangeText={(value) => handleChange('cor', value)}
            style={styles.input}
            mode="outlined"
          />

          <Button 
            mode="contained" 
            onPress={handleSubmit}
            loading={carregando}
            disabled={carregando}
            style={styles.botao}
          >
            Adicionar Veículo
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.botao}
          >
            Cancelar
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  card: {
    marginBottom: 20,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600'
  },
  segmented: {
    marginBottom: 16,
  },
  botao: {
    marginTop: 8,
  }
});