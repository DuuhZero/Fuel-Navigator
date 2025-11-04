"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excluirUsuario = exports.atualizarUsuario = exports.obterUsuario = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const obterUsuario = async (req, res) => {
    try {
        const usuario = await Usuario_1.default.findById(req.usuario._id).select('-senha');
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter usuário' });
    }
};
exports.obterUsuario = obterUsuario;
const atualizarUsuario = async (req, res) => {
    try {
        const { nome, email, currentPassword, newPassword, preferencias, alertasConfig } = req.body;
        const updateFields = {
            dataAtualizacao: new Date()
        };
        if (nome)
            updateFields.nome = nome;
        if (email)
            updateFields.email = email;
        if (preferencias)
            updateFields.preferencias = preferencias;
        if (alertasConfig)
            updateFields.alertasConfig = alertasConfig;
        // Tratamento de troca de senha
        if (newPassword) {
            if (!currentPassword) {
                res.status(400).json({ message: 'Senha atual necessária para alterar a senha' });
                return;
            }
            const usuarioAtual = await Usuario_1.default.findById(req.usuario._id).select('+senha');
            if (!usuarioAtual) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }
            const senhaValida = await bcryptjs_1.default.compare(currentPassword, usuarioAtual.senha);
            if (!senhaValida) {
                res.status(400).json({ message: 'Senha atual incorreta' });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            updateFields.senha = await bcryptjs_1.default.hash(newPassword, salt);
        }
        // Se email for alterado, verificar se já existe
        if (email) {
            const existente = await Usuario_1.default.findOne({ email });
            if (existente && String(existente._id) !== String(req.usuario._id)) {
                res.status(400).json({ message: 'Email já em uso' });
                return;
            }
        }
        const usuario = await Usuario_1.default.findByIdAndUpdate(req.usuario._id, updateFields, { new: true }).select('-senha');
        res.json(usuario);
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};
exports.atualizarUsuario = atualizarUsuario;
const excluirUsuario = async (req, res) => {
    try {
        await Usuario_1.default.findByIdAndDelete(req.usuario._id);
        res.json({ message: 'Usuário excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
};
exports.excluirUsuario = excluirUsuario;
//# sourceMappingURL=usuarioController.js.map