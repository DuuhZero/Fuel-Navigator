import express from 'express';
import { autenticar } from '../middleware/auth';
import {
  listarAlertas,
  marcarComoLida,
  criarAlerta,
  configurarAlertas
} from '../controllers/alertaController';

const router = express.Router();

router.use(autenticar);

router.get('/', listarAlertas);
router.put('/:id/lida', marcarComoLida);
router.post('/', criarAlerta);
router.put('/config', configurarAlertas);

export default router;