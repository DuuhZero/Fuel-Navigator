"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarAlertas = exports.criarAlerta = exports.marcarComoLida = exports.listarAlertas = void 0;
const Alerta_1 = __importDefault(require("../models/Alerta"));
const listarAlertas = async (req, res) => {
    try {
        const alertas = await Alerta_1.default.find({ usuarioId: req.usuario._id }).sort({ dataCriacao: -1 });
        res.json(alertas);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao listar alertas' });
    }
};
exports.listarAlertas = listarAlertas;
const marcarComoLida = async (req, res) => {
    try {
        const alerta = await Alerta_1.default.findOneAndUpdate({ _id: req.params.id, usuarioId: req.usuario._id }, { lida: true }, { new: true });
        if (!alerta) {
            res.status(404).json({ message: 'Alerta não encontrado' });
            return;
        }
        res.json(alerta);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao marcar alerta como lida' });
    }
};
exports.marcarComoLida = marcarComoLida;
const criarAlerta = async (req, res) => {
    try {
        const alertaData = { ...req.body, usuarioId: req.usuario._id };
        const alerta = new Alerta_1.default(alertaData);
        await alerta.save();
        res.status(201).json(alerta);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar alerta' });
    }
};
exports.criarAlerta = criarAlerta;
const configurarAlertas = async (req, res) => {
    try {
        res.json({ message: 'Alertas configurados' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao configurar alertas' });
    }
};
exports.configurarAlertas = configurarAlertas;
//# sourceMappingURL=alertaController.js.map