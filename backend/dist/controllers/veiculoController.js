"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excluirVeiculo = exports.atualizarVeiculo = exports.obterVeiculo = exports.listarVeiculos = exports.criarVeiculo = void 0;
const Veiculo_1 = __importDefault(require("../models/Veiculo"));
const criarVeiculo = async (req, res) => {
    try {
        const veiculoData = {
            ...req.body,
            usuarioId: req.usuario._id,
            consumoMedio: parseFloat(req.body.consumoMedio)
        };
        const veiculo = new Veiculo_1.default(veiculoData);
        await veiculo.save();
        res.status(201).json({
            message: 'Veículo criado com sucesso',
            veiculo
        });
    }
    catch (error) {
        console.error('Erro ao criar veículo:', error);
        res.status(500).json({ message: 'Erro ao criar veículo' });
    }
};
exports.criarVeiculo = criarVeiculo;
const listarVeiculos = async (req, res) => {
    try {
        const veiculos = await Veiculo_1.default.find({ usuarioId: req.usuario._id });
        res.json(veiculos);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao listar veículos' });
    }
};
exports.listarVeiculos = listarVeiculos;
const obterVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo_1.default.findOne({
            _id: req.params.id,
            usuarioId: req.usuario._id
        });
        if (!veiculo) {
            res.status(404).json({ message: 'Veículo não encontrado' });
            return;
        }
        res.json(veiculo);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter veículo' });
    }
};
exports.obterVeiculo = obterVeiculo;
const atualizarVeiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body, dataAtualizacao: new Date() };
        if (updates.consumoMedio) {
            updates.consumoMedio = parseFloat(updates.consumoMedio);
        }
        const veiculo = await Veiculo_1.default.findOneAndUpdate({ _id: id, usuarioId: req.usuario._id }, updates, { new: true, runValidators: true });
        if (!veiculo) {
            res.status(404).json({ message: 'Veículo não encontrado' });
            return;
        }
        res.json({
            message: 'Veículo atualizado com sucesso',
            veiculo
        });
    }
    catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        res.status(500).json({ message: 'Erro ao atualizar veículo' });
    }
};
exports.atualizarVeiculo = atualizarVeiculo;
const excluirVeiculo = async (req, res) => {
    try {
        const veiculo = await Veiculo_1.default.findOneAndDelete({
            _id: req.params.id,
            usuarioId: req.usuario._id
        });
        if (!veiculo) {
            res.status(404).json({ message: 'Veículo não encontrado' });
            return;
        }
        res.json({ message: 'Veículo excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir veículo' });
    }
};
exports.excluirVeiculo = excluirVeiculo;
//# sourceMappingURL=veiculoController.js.map