import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  criarVeiculo,
  listarVeiculos,
  obterVeiculo,
  atualizarVeiculo,
  excluirVeiculo
} from '../controllers/veiculoController';

const router = express.Router();

router.use(autenticar);

router.post('/', criarVeiculo);
router.get('/', listarVeiculos);
router.get('/:id', obterVeiculo);
router.put('/:id', atualizarVeiculo);
router.delete('/:id', excluirVeiculo);

export default router;