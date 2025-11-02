"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registrar = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';
const registrar = async (req, res) => {
    try {
        const { nome, email, senha, telefone, dataNascimento } = req.body;
        const usuarioExistente = await Usuario_1.default.findOne({ email });
        if (usuarioExistente) {
            res.status(400).json({ message: 'Usuário já existe' });
            return;
        }
        const novoUsuario = new Usuario_1.default({
            nome,
            email,
            senha,
            telefone,
            dataNascimento,
            preferencias: {
                tema: 'claro',
                unidadeConsumo: 'km_l',
                moeda: 'BRL'
            },
            alertasConfig: {
                notificacoesAtivas: true
            }
        });
        await novoUsuario.save();
        const token = jsonwebtoken_1.default.sign({ userId: novoUsuario._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            usuario: {
                id: novoUsuario._id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });
    }
    catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.registrar = registrar;
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario_1.default.findOne({ email });
        if (!usuario) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        const senhaValida = await usuario.compararSenha(senha);
        if (!senhaValida) {
            res.status(401).json({ message: 'Credenciais inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: usuario._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map