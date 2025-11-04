"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const usuarioController_1 = require("../controllers/usuarioController");
const router = express_1.default.Router();
router.use(auth_1.autenticar);
router.get('/', usuarioController_1.obterUsuario);
router.put('/', usuarioController_1.atualizarUsuario);
router.delete('/', usuarioController_1.excluirUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map