import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Coordenada } from '../types';

const { width, height } = Dimensions.get('window');

interface OpenRouteMapProps {
  coordenadas: Coordenada[];
  origem: string;
  destino: string;
  altura?: number;
}

const OpenRouteMap: React.FC<OpenRouteMapProps> = ({
  coordenadas,
  origem,
  destino,
  altura = 300
}) => {
  const hasValidCoordinates = coordenadas && coordenadas.length > 0 && 
                             coordenadas[0].latitude !== undefined && 
                             coordenadas[0].longitude !== undefined;

  if (!hasValidCoordinates) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            🗺️ Aguardando cálculo de rota...
          </Text>
        </View>
      </View>
    );
  }

  const coordinates = coordenadas.map(coord => [coord.longitude, coord.latitude]);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenRoute Service Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .leaflet-control-zoom { margin-top: 70px !important; }
        .custom-marker {
          background: #dc3545;
          border: 2px solid white;
          border-radius: 50%;
          width: 12px;
          height: 12px;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Coordenadas da rota
        var routeCoordinates = ${JSON.stringify(coordinates)};
        
        // Converter para formato LatLng do Leaflet
        var latLngCoordinates = routeCoordinates.map(coord => L.latLng(coord[1], coord[0]));
        
        // Calcular centro do mapa
        var bounds = L.latLngBounds(latLngCoordinates);
        var center = bounds.getCenter();
        
        // Inicializar o mapa
        var map = L.map('map').setView([center.lat, center.lng], 13);
        
        // Adicionar camada base do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        // Criar a polyline da rota em VERMELHO
        var polyline = L.polyline(latLngCoordinates, {
            color: '#dc3545',
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round',
            dashArray: '1, 1'
        }).addTo(map);
        
        // Ajustar o zoom para mostrar toda a rota
        map.fitBounds(bounds);
        
        // marcador de origem 
        var originMarker = L.marker(latLngCoordinates[0], {
            title: 'Origem: ${origem}'
        }).addTo(map).bindPopup(
            '<div style="font-weight: bold; color: #871919ff;">📍 Origem</div>' +
            '<div>${origem}</div>'
        );
        
        // marcador de destino 
        var destinationMarker = L.marker(latLngCoordinates[latLngCoordinates.length - 1], {
            title: 'Destino: ${destino}'
        }).addTo(map).bindPopup(
            '<div style="font-weight: bold; color: #0d6efd;">🎯 Destino</div>' +
            '<div>${destino}</div>'
        );
        
        //  ponto inicial 
        L.circleMarker(latLngCoordinates[0], {
            color: '#198754',
            fillColor: '#198754',
            fillOpacity: 1,
            radius: 8,
            weight: 3
        }).addTo(map);
        
        //ponto final 
        L.circleMarker(latLngCoordinates[latLngCoordinates.length - 1], {
            color: '#fd0d0dff',
            fillColor: '#fd0d0dff',
            fillOpacity: 1,
            radius: 8,
            weight: 3
        }).addTo(map);
        
        // Adicionar controle de zoom
        L.control.zoom({ position: 'topright' }).addTo(map);
        
        console.log('Mapa carregado com', latLngCoordinates.length, 'pontos');
        
    </script>
</body>
</html>
  `;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default OpenRouteMap;