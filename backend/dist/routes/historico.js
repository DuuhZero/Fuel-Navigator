"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const historicoController_1 = require("../controllers/historicoController");
const router = express_1.default.Router();
router.use(auth_1.autenticar);
router.post('/', historicoController_1.criarHistorico);
router.get('/', historicoController_1.listarHistorico);
router.get('/relatorio', historicoController_1.gerarRelatorioPeriodo);
router.get('/:id', historicoController_1.obterHistorico);
router.delete('/:id', historicoController_1.excluirHistorico);
exports.default = router;
//# sourceMappingURL=historico.js.map