import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  calcularRota,
  listarRotas,
  obterRota,
  salvarRota,
  atualizarRota,
  excluirRota,
  testarAPI
} from '../controllers/rotaController';

const router = express.Router();

router.use(autenticar);

router.post('/calcular', calcularRota);
router.post('/', salvarRota);
router.get('/', listarRotas);
router.get('/:id', obterRota);
router.put('/:id', atualizarRota);
router.delete('/:id', excluirRota);
router.get('/teste/conexao', testarAPI); // Rota para testar a API

export default router;