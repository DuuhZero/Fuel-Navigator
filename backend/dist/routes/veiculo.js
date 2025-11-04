"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const veiculoController_1 = require("../controllers/veiculoController");
const router = express_1.default.Router();
router.use(auth_1.autenticar);
router.post('/', veiculoController_1.criarVeiculo);
router.get('/', veiculoController_1.listarVeiculos);
router.get('/:id', veiculoController_1.obterVeiculo);
router.put('/:id', veiculoController_1.atualizarVeiculo);
router.delete('/:id', veiculoController_1.excluirVeiculo);
exports.default = router;
//# sourceMappingURL=veiculo.js.map