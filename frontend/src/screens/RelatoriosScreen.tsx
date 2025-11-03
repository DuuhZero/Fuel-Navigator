import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card, ActivityIndicator, ProgressBar } from 'react-native-paper';
import api from '../services/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


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

  const [progresso, setProgresso] = useState<number>(0);

  const salvarEmDownloadsAndroid = async (localUri: string, filename: string) => {
    try {
      if (Platform.OS !== 'android') return false;
      // Solicita permissão para o usuário escolher uma pasta (ex.: Downloads)
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) return false;

      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        'application/pdf'
      );
      await FileSystem.writeAsStringAsync(destUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return true;
    } catch (e) {
      console.error('Erro ao salvar via SAF:', e);
      return false;
    }
  };

  const downloadPDF = async () => {
    try {
      setCarregando(true);
      setProgresso(0);

    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

  // Compat: inclui token na query para funcionar mesmo se o alias do Vercel ainda apontar para deploy antigo
  const url = `${api.defaults.baseURL}/relatorios/pdf?token=${token}`;

      const filename = `relatorio-${new Date().toISOString().slice(0, 10)}.pdf`;
      const destino = `${FileSystem.cacheDirectory}${filename}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        destino,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf' },
        },
        (dp) => {
          if (dp.totalBytesExpectedToWrite > 0) {
            setProgresso(dp.totalBytesWritten / dp.totalBytesExpectedToWrite);
          }
        }
      );

      const result = await downloadResumable.downloadAsync();
      const localUri = result?.uri ?? destino;

      // Verifica status/headers para garantir que é um PDF válido
      const status = (result as any)?.status as number | undefined;
      const headers = (result as any)?.headers ?? {};
      const contentType = (headers['Content-Type'] || headers['content-type'] || '').toString();
      if (status && status !== 200) {
        // Lê o corpo como texto para exibir mensagem de erro do backend
        try {
          const text = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.UTF8 });
          try {
            const json = JSON.parse(text);
            const msg = json?.message || JSON.stringify(json);
            throw new Error(msg);
          } catch {
            throw new Error(text.slice(0, 500));
          }
        } catch (e) {
          throw new Error('Falha no download do relatório');
        }
      }
      if (contentType && !contentType.includes('application/pdf')) {
        // Provavelmente retornou HTML/JSON de erro
        try {
          const text = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.UTF8 });
          throw new Error(text.slice(0, 500));
        } catch {
          throw new Error('Resposta não é um PDF válido');
        }
      }

      // Validação adicional: arquivo muito pequeno ou sem assinatura %PDF
      const info = await FileSystem.getInfoAsync(localUri);
      if (!info.exists || (info.size ?? 0) < 500) {
        try {
          const text = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.UTF8 });
          throw new Error(text.slice(0, 500) || 'Arquivo muito pequeno');
        } catch {
          throw new Error('Arquivo inválido ou incompleto');
        }
      }
      try {
        const head = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.UTF8 });
        if (!head.startsWith('%PDF')) {
          throw new Error('Conteúdo não começa com %PDF');
        }
      } catch (e) {
        throw new Error('Arquivo recebido não é um PDF válido');
      }

      // Tenta salvar em uma pasta escolhida (Android); se não, abre o compartilhador do sistema
      let salvo = false;
      if (Platform.OS === 'android') {
        salvo = await salvarEmDownloadsAndroid(localUri, filename);
      }

      if (!salvo) {
        const sharingOk = await Sharing.isAvailableAsync();
        if (sharingOk) {
          await Sharing.shareAsync(localUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Relatório PDF',
            UTI: 'com.adobe.pdf',
          });
        } else {
          // Fallback simples: tentar abrir o arquivo local
          Alert.alert('Sucesso', `Arquivo baixado em: ${localUri}`);
        }
      } else {
        Alert.alert('Sucesso', 'Relatório salvo com sucesso.');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao baixar relatório:', errorMsg);
      Alert.alert('Erro', 'Falha ao baixar o relatório PDF');
    } finally {
      setCarregando(false);
      setProgresso(0);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineMedium" style={styles.titulo}>Relatório Mensal</Text>

      {carregando && (
        <View style={{ marginVertical: 12 }}>
          <ActivityIndicator animating size="large" />
          {progresso > 0 && (
            <View style={{ marginTop: 8 }}>
              <ProgressBar progress={progresso} />
              <Text style={{ marginTop: 4, textAlign: 'center' }}>{Math.round(progresso * 100)}%</Text>
            </View>
          )}
        </View>
      )}

      {dados && (
        <Card style={{ marginVertical: 12, padding: 12 }}>
          <Text>Distância total (30 dias): {dados.totalDistance?.toFixed(2) ?? 0} km</Text>
          <Text>Consumo total estimado: {dados.totalConsumption?.toFixed(2) ?? 0} L</Text>
          <Text>Número de rotas traçadas: {dados.numRoutes ?? 0}</Text>
          <Text>Veículo mais utilizado: {dados.mostUsedVehicle ? `${dados.mostUsedVehicle.marca || ''} ${dados.mostUsedVehicle.modelo || ''} (usos: ${dados.mostUsedVehicle.count})` : '-'}</Text>
        </Card>
      )}

      {/* <Button
        mode="contained"
        onPress={downloadPDF}
        style={{ marginTop: 8 }}
        loading={carregando}
        disabled={carregando}
      >
        {carregando ? 'Baixando...' : 'Baixar Relatório (PDF)'}
      </Button> */}
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
