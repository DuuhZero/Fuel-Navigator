import express from 'express';
import mongoose from 'mongoose';
import { autenticar, AuthRequest } from '../middleware/auth';
import { OpenRouteService } from '../services/openRouteService';
import Veiculo from '../models/Veiculo';
import HistoricoViagem from '../models/HistoricoViagem';

const router = express.Router();

// Exige autenticação para todas as rotas de /rotas
router.use(autenticar);

// POST /api/rotas/calcular — calcula uma rota usando OpenRouteService
router.post('/calcular', async (req: AuthRequest, res: express.Response) => {
  try {
    const { origem, destino, veiculoId, precoCombustivel } = req.body;

    if (!origem || !destino || !veiculoId) {
      res.status(400).json({ message: 'Origem, destino e veiculoId são obrigatórios' });
      return;
    }

    // Validar veículo do usuário
  const veiculo = await Veiculo.findOne({ _id: veiculoId, usuarioId: req.usuario!._id });
    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
      return;
    }

    // Geocodificar
    const [origemFeatures, destinoFeatures] = await Promise.all([
      OpenRouteService.geocoder(origem),
      OpenRouteService.geocoder(destino)
    ]);

    if (!origemFeatures?.[0]) {
      res.status(400).json({ message: `Endereço de origem não encontrado: ${origem}` });
      return;
    }
    if (!destinoFeatures?.[0]) {
      res.status(400).json({ message: `Endereço de destino não encontrado: ${destino}` });
      return;
    }

    const origemCoords: [number, number] = origemFeatures[0].geometry.coordinates; // [lon, lat]
    const destinoCoords: [number, number] = destinoFeatures[0].geometry.coordinates; // [lon, lat]

    // Calcular rota
    const rotaData = await OpenRouteService.calcularRota(origemCoords, destinoCoords);

    // Cálculos auxiliares
    const consumoEstimado = rotaData.distance / veiculo.consumoMedio; // km / (km/L) = L
    const custoEstimado = precoCombustivel ? (consumoEstimado * parseFloat(precoCombustivel)) : undefined;

    // Resposta no formato esperado pelo app
    res.status(200).json({
      distancia: rotaData.distance,      // km (número)
      duracao: rotaData.duration,        // minutos (número)
      consumoEstimado,                   // litros (número)
      custoEstimado,                     // R$ (número | undefined)
      coordenadas: rotaData.coordinates, // Array<{ latitude, longitude }>
      origem,
      destino
    });
  } catch (error: any) {
    console.error('Erro ao calcular rota:', error?.message || error);
    res.status(500).json({ message: 'Erro interno do servidor. Tente novamente em alguns instantes.' });
  }
});

// POST /api/rotas — salva um registro básico no histórico (KISS)
router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const {
      veiculoId,
      distancia,
      duracao,
      consumoEstimado,
      custoEstimado,
      precoCombustivel,
      origem,
      destino,
      coordenadas
    } = req.body;

    if (!veiculoId || distancia == null || duracao == null || consumoEstimado == null) {
      res.status(400).json({ message: 'veiculoId, distancia, duracao e consumoEstimado são obrigatórios' });
      return;
    }

    // Validar ObjectId para evitar documentos inválidos que quebram o populate do histórico
    if (!mongoose.Types.ObjectId.isValid(veiculoId)) {
      res.status(400).json({ message: 'veiculoId inválido' });
      return;
    }

    // Persistir como histórico mínimo (sem depender do schema de Rota)
    await HistoricoViagem.create({
  usuarioId: req.usuario!._id,
      veiculoId,
      origem: origem || '',
      destino: destino || '',
      consumoEstimado,
      custoEstimado,
      precoCombustivel,
      distancia,
      duracao,
      dadosRota: {
        coordenadas: Array.isArray(coordenadas) ? coordenadas : []
      }
    });

    res.status(201).json({ message: 'Rota salva com sucesso' });
  } catch (error: any) {
    console.error('Erro ao salvar rota:', error?.message || error);
    res.status(500).json({ message: 'Erro ao salvar rota' });
  }
});

export default router;