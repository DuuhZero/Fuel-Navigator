import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { OpenRouteService } from '../services/openRouteService';
import Veiculo from '../models/Veiculo';
import { Coordenada } from '../types';
import polyline from 'polyline';

export const calcularRota = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { origem, destino, veiculoId, precoCombustivel } = req.body;

    console.log('📍 Recebida requisição de rota:', { origem, destino, veiculoId });

    if (!origem || !destino || !veiculoId) {
      res.status(400).json({ message: 'Origem, destino e veiculoId são obrigatórios' });
      return;
    }

    const veiculo = await Veiculo.findOne({
      _id: veiculoId,
      usuarioId: req.usuario._id
    });

    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
      return;
    }


    let featuresOrigem, featuresDestino;

    try {
      console.log('🛰️  Iniciando geocoding...');
      [featuresOrigem, featuresDestino] = await Promise.all([
        OpenRouteService.geocoder(origem),
        OpenRouteService.geocoder(destino)
      ]);
      console.log('✅ Geocoding completo');
    } catch (error: any) {
      console.error('❌ Erro no geocoding:', error.message);
      res.status(400).json({
        message: 'Erro ao processar endereços. Verifique se os endereços estão corretos.'
      });
      return;
    }

    if (!featuresOrigem || featuresOrigem.length === 0) {
      res.status(400).json({ message: `Endereço de origem não encontrado: ${origem}` });
      return;
    }

    if (!featuresDestino || featuresDestino.length === 0) {
      res.status(400).json({ message: `Endereço de destino não encontrado: ${destino}` });
      return;
    }


    const coordsOrigem = featuresOrigem[0].geometry.coordinates; 
    const coordsDestino = featuresDestino[0].geometry.coordinates; 

    console.log('📍 Coordenadas convertidas:', {
      origem: coordsOrigem,
      destino: coordsDestino
    });


    let dadosRota;
    try {
      console.log('🛣️  Calculando rota...');
      dadosRota = await OpenRouteService.calcularRota(coordsOrigem, coordsDestino);
      console.log('✅ Rota calculada com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no cálculo da rota:', error.message);
      res.status(400).json({
        message: 'Não foi possível calcular uma rota entre os endereços informados.'
      });
      return;
    }


    console.log('📦 Estrutura COMPLETA da resposta:', JSON.stringify(dadosRota, null, 2).substring(0, 1000));


    let distancia, duracao, geometry;

    if (dadosRota.routes && dadosRota.routes.length > 0) {
      const rotaPrincipal = dadosRota.routes[0];
      distancia = rotaPrincipal.summary.distance / 1000; 
      duracao = rotaPrincipal.summary.duration / 60;
      geometry = rotaPrincipal.geometry;

      console.log('📍 Geometry type:', typeof geometry, 'Length:', geometry?.length);
    } else {
      throw new Error('Formato de resposta da API não reconhecido');
    }

   
    let coordenadas: Coordenada[] = [];

    if (geometry && typeof geometry === 'string') {
      console.log('🔄 Decodificando polyline...');
      try {

        const decoded: number[][] = polyline.decode(geometry);
        console.log(`✅ ${decoded.length} pontos decodificados`);


        coordenadas = decoded.map((coord: number[]) => {
          if (coord.length >= 2) {
            return {
              latitude: coord[0],
              longitude: coord[1]
            };
          } else {
            console.warn('⚠️ Coordenada inválida:', coord);
            return { latitude: 0, longitude: 0 }; 
          }
        }).filter(coord => coord.latitude !== 0 && coord.longitude !== 0);

        console.log('📍 Primeiras coordenadas decodificadas:', coordenadas.slice(0, 3));

      } catch (decodeError) {
        console.error('❌ Erro ao decodificar polyline:', decodeError);
      }
    } else {
      console.warn('⚠️ Geometry não é uma string (polyline)');
    }
    const consumoEstimado = distancia / veiculo.consumoMedio;
    let custoEstimado = undefined;

    if (precoCombustivel) {
      custoEstimado = consumoEstimado * precoCombustivel;
    }


    console.log('📊 Resultado final:', {
      distancia: `${distancia.toFixed(1)} km`,
      duracao: `${Math.round(duracao)} min`,
      consumo: `${consumoEstimado.toFixed(1)} L`,
      coordenadas: `${coordenadas.length} pontos`
    });

    res.json({
      distancia,
      duracao,
      consumoEstimado,
      custoEstimado,
      coordenadas,
      origem: featuresOrigem[0].properties.label,
      destino: featuresDestino[0].properties.label
    });

  } catch (error) {
    console.error('❌ Erro geral ao calcular rota:', error);
    res.status(500).json({
      message: 'Erro interno do servidor. Tente novamente em alguns instantes.'
    });
  }
};
export const listarRotas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Lista de rotas - funcionalidade em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar rotas' });
  }
};

export const obterRota = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Rota específica - funcionalidade em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter rota' });
  }
};

export const salvarRota = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Rota salva - funcionalidade em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar rota' });
  }
};

export const atualizarRota = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Rota atualizada - funcionalidade em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar rota' });
  }
};

export const excluirRota = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Rota excluída - funcionalidade em desenvolvimento' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir rota' });
  }
};

export const testarAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const coordsOrigem: [number, number] = [-46.6333, -23.5505]; 
    const coordsDestino: [number, number] = [-46.3333, -23.9608]; 

    const dadosRota = await OpenRouteService.calcularRota(coordsOrigem, coordsDestino);

    res.json({
      success: true,
      estrutura: {
        routes: dadosRota.routes ? `Array(${dadosRota.routes.length})` : 'undefined',
        features: dadosRota.features ? `Array(${dadosRota.features.length})` : 'undefined'
      },
      dados: dadosRota
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};