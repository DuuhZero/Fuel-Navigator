"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const relatorioController_1 = require("../controllers/relatorioController");
const router = express_1.default.Router();
// Todas as rotas agora são protegidas
router.use(auth_1.autenticar);
router.get('/pdf', relatorioController_1.gerarRelatorioPDF);
router.get('/mensal', relatorioController_1.gerarRelatorioMensal);
router.get('/semanal', auth_1.autenticar, relatorioController_1.gerarRelatorioSemanal);
exports.default = router;
//# sourceMappingURL=relatorio.js.map