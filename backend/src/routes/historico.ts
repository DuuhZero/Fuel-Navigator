import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  criarHistorico,
  listarHistorico,
  obterHistorico,
  excluirHistorico,
  gerarRelatorioPeriodo
} from '../controllers/historicoController';

const router = express.Router();

router.use(autenticar);

router.post('/', criarHistorico);
router.get('/', listarHistorico);
router.get('/relatorio', gerarRelatorioPeriodo);
router.get('/:id', obterHistorico);
router.delete('/:id', excluirHistorico);

export default router;