import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function HistoricoScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Histórico de Viagens</Text>
      <Text style={styles.text}>Funcionalidade em desenvolvimento...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
  },
});