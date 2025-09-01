import axios from 'axios';

const OPENROUTE_API_KEY ='eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImY2N2Q1YTI5Yjg5MjRiZTA5YTQyZDk3MjI0MmM0NDM3IiwiaCI6Im11cm11cjY0In0=';
export class OpenRouteService {
  static async calcularRota(origem: [number, number], destino: [number, number], perfil: string = 'driving-car') {
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/${perfil}`,
        {
          coordinates: [origem, destino],
          instructions: false,
          elevation: false,
          format: 'geojson'
        },
        {
          headers: {
            'Authorization': OPENROUTE_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado ao calcular rota:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error('Falha ao calcular rota');
    }
  }

  static async geocoder(query: string) {
    try {
      console.log('Enviando requisição para geocoder com chave:', OPENROUTE_API_KEY);
      
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search`,
        {
          params: {
            text: query,
            size: 3,
            'boundary.country': 'BR'
          },
          headers: {
            'Authorization': OPENROUTE_API_KEY
          }
        }
      );

      console.log('Resposta do geocoder:', response.status);
      return response.data.features;
    } catch (error: any) {
      console.error('Erro detalhado no geocoder:', {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        message: error.message
      });
      throw new Error('Falha ao geocodificar endereço');
    }
  }

  static async reverseGeocoder(coords: [number, number]) {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse`,
        {
          params: {
            point: {
              lat: coords[1],
              lon: coords[0]
            },
            size: 1,
            "boundary.country": 'BR'
          },
          headers: {
            'Authorization': OPENROUTE_API_KEY,
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
          }
        }
      );

      return response.data.features[0];
    } catch (error: any) {
      console.error('Erro no reverse geocoder:', error.response?.data || error.message);
      throw new Error('Falha ao reverse geocodificar coordenadas');
    }
  }


  static async testarConexao() {
    try {
      const response = await axios.get(
        'https://api.openrouteservice.org/v2/health',
        {
          headers: {
            'Authorization': OPENROUTE_API_KEY
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao testar conexão com OpenRoute:', error.response?.data || error.message);
      throw new Error('Falha na conexão com o serviço de rotas');
    }
  }
}