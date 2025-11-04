"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const rotaController_1 = require("../controllers/rotaController");
const router = express_1.default.Router();
// Rota de cálculo — exige autenticação para que possamos salvar histórico com usuarioId
router.post('/calcular', auth_1.autenticar, rotaController_1.calcularRota);
// CRUD de rotas (protegidas)
router.post('/', auth_1.autenticar, rotaController_1.salvarRota);
router.get('/', auth_1.autenticar, rotaController_1.listarRotas);
router.get('/testar', rotaController_1.testarAPI);
router.get('/:id', auth_1.autenticar, rotaController_1.obterRota);
router.put('/:id', auth_1.autenticar, rotaController_1.atualizarRota);
router.delete('/:id', auth_1.autenticar, rotaController_1.excluirRota);
exports.default = router;
//# sourceMappingURL=rota.js.map