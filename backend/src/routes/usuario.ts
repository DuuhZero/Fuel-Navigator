import express from 'express';
import { autenticar } from '../middleware/auth';
import { atualizarUsuario, obterUsuario, excluirUsuario } from '../controllers/usuarioController';

const router = express.Router();

router.use(autenticar);

router.get('/', obterUsuario);
router.put('/', atualizarUsuario);
router.delete('/', excluirUsuario);

export default router;