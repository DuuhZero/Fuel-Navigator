"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticar = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';
const autenticar = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'Token de acesso necessário' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const usuario = await Usuario_1.default.findById(decoded.userId).select('-senha');
        if (!usuario) {
            res.status(401).json({ message: 'Token inválido' });
            return;
        }
        req.usuario = usuario;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
exports.autenticar = autenticar;
//# sourceMappingURL=auth.js.map