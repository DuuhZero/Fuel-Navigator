import express, { Request, Response } from 'express';
import { autenticar } from '../middleware/auth';
import {
  calcularRota,
  listarRotas,
  obterRota,
  salvarRota,
  atualizarRota,
  excluirRota
} from '../controllers/rotaController';
import { OpenRouteService } from '../services/openRouteService'; // Ensure this import exists

const router = express.Router();

router.use(autenticar);

router.post('/calcular', calcularRota);
router.post('/', salvarRota);
router.get('/', listarRotas);
router.get('/:id', obterRota);
router.put('/:id', atualizarRota);
router.get('/teste-conexao', async (req: Request, res: Response) => {
  try {
    const resultado = await OpenRouteService.testarConexao();
    res.json(resultado);
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;