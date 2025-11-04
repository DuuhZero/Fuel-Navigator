import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, SegmentedButtons, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

export default function AdicionarVeiculoScreen() {
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const { colors, toggleTheme } = useTheme();
  
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
    // marca e ano agora são opcionais; exigir somente modelo e consumo médio
    if (!formData.modelo || !formData.consumoMedio) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios: modelo e consumo médio');
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <TextInput
              label="Marca "
              value={formData.marca}
              onChangeText={(value) => handleChange('marca', value)}
              style={styles.input}
              mode="outlined"
              textColor={colors.text}
            />

          <TextInput
            label="Modelo *"
            value={formData.modelo}
            onChangeText={(value) => handleChange('modelo', value)}
            style={styles.input}
            mode="outlined"
            textColor={colors.text}
          />

          <TextInput
            label="Ano "
            value={formData.ano}
            onChangeText={(value) => handleChange('ano', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            textColor={colors.text}
          />

          <TextInput
            label="Placa"
            value={formData.placa}
            onChangeText={(value) => handleChange('placa', value)}
            style={styles.input}
            mode="outlined"
            textColor={colors.text}
          />

          <TextInput
            label="Consumo Médio (km/L) *"
            value={formData.consumoMedio}
            onChangeText={(value) => handleChange('consumoMedio', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            textColor={colors.text}
          />

          <Text style={[styles.label, { color: colors.text }]}>Tipo de Combustível *</Text>
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
            textColor={colors.text}
          />

          <TextInput
            label="Cor"
            value={formData.cor}
            onChangeText={(value) => handleChange('cor', value)}
            style={styles.input}
            mode="outlined"
            textColor={colors.text}
          />

          <Button 
            mode="contained" 
            onPress={handleSubmit}
            loading={carregando}
            disabled={carregando}
            style={[styles.botao, { backgroundColor: colors.primary }]}
            textColor="#000"
          >
            Adicionar Veículo
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.botao}
            textColor={colors.text}
          >
            Cancelar
          </Button>
        </Card.Content>
      </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:-20,
    backgroundColor: '#f5f5f5'
  },
  headerGradient: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    borderRadius: 14,
    padding: 10,
    zIndex: 50,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  scrollContent: {
    marginTop: 70,
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