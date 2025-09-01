import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  gerarRelatorioPDF,
  gerarRelatorioMensal,
  gerarRelatorioSemanal
} from '../controllers/relatorioController';

const router = express.Router();

router.use(autenticar);

router.get('/pdf', gerarRelatorioPDF);
router.get('/mensal', gerarRelatorioMensal);
router.get('/semanal', gerarRelatorioSemanal);

export default router;