"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const alertaController_1 = require("../controllers/alertaController");
const router = express_1.default.Router();
router.use(auth_1.autenticar);
router.get('/', alertaController_1.listarAlertas);
router.put('/:id/lida', alertaController_1.marcarComoLida);
router.post('/', alertaController_1.criarAlerta);
router.put('/config', alertaController_1.configurarAlertas);
exports.default = router;
//# sourceMappingURL=alerta.js.map