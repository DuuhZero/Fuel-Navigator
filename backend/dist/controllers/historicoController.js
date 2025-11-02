"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioPeriodo = exports.excluirHistorico = exports.obterHistorico = exports.listarHistorico = exports.criarHistorico = void 0;
const HistoricoViagem_1 = __importDefault(require("../models/HistoricoViagem"));
const criarHistorico = async (req, res) => {
    try {
        const historicoData = {
            ...req.body,
            usuarioId: req.usuario._id,
            origem: req.body.origem,
            destino: req.body.destino
        };
        const historico = new HistoricoViagem_1.default(historicoData);
        await historico.save();
        res.status(201).json(historico);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar histórico' });
    }
};
exports.criarHistorico = criarHistorico;
const listarHistorico = async (req, res) => {
    try {
        const historicos = await HistoricoViagem_1.default.find({ usuarioId: req.usuario._id })
            .populate('veiculoId', 'marca modelo placa')
            .populate('rotaId', 'origem destino origemEndereco destinoEndereco distancia duracao')
            .sort({ dataViagem: -1 });
        res.json(historicos);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao listar histórico' });
    }
};
exports.listarHistorico = listarHistorico;
const obterHistorico = async (req, res) => {
    try {
        const historico = await HistoricoViagem_1.default.findOne({
            _id: req.params.id,
            usuarioId: req.usuario._id
        }).populate('veiculoId').populate('rotaId');
        if (!historico) {
            res.status(404).json({ message: 'Histórico não encontrado' });
            return;
        }
        res.json(historico);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter histórico' });
    }
};
exports.obterHistorico = obterHistorico;
const excluirHistorico = async (req, res) => {
    try {
        const historico = await HistoricoViagem_1.default.findOneAndDelete({
            _id: req.params.id,
            usuarioId: req.usuario._id
        });
        if (!historico) {
            res.status(404).json({ message: 'Histórico não encontrado' });
            return;
        }
        res.json({ message: 'Histórico excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir histórico' });
    }
};
exports.excluirHistorico = excluirHistorico;
const gerarRelatorioPeriodo = async (req, res) => {
    try {
        const { inicio, fim } = req.query;
        res.json({ message: 'Relatório gerado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
};
exports.gerarRelatorioPeriodo = gerarRelatorioPeriodo;
//# sourceMappingURL=historicoController.js.map