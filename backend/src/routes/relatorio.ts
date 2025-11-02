import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  gerarRelatorioPDF,
  gerarRelatorioMensal,
  gerarRelatorioSemanal
} from '../controllers/relatorioController';

const router = express.Router();

// Permitir download via navegador com token na query (sem header Authorization)
router.get('/pdf', gerarRelatorioPDF);

// Demais rotas exigem autenticação via header
router.use(autenticar);

router.get('/mensal', gerarRelatorioMensal);
router.get('/semanal', gerarRelatorioSemanal);

export default router;