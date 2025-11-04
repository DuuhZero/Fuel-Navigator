"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testarAPI = exports.excluirRota = exports.atualizarRota = exports.salvarRota = exports.obterRota = exports.listarRotas = exports.calcularRota = void 0;
const openRouteService_1 = require("../services/openRouteService");
const Veiculo_1 = __importDefault(require("../models/Veiculo"));
const polyline_1 = __importDefault(require("polyline"));
const HistoricoViagem_1 = __importDefault(require("../models/HistoricoViagem"));
const Rota_1 = __importDefault(require("../models/Rota"));
const calcularRota = async (req, res) => {
    try {
        const { origem, destino, veiculoId, precoCombustivel } = req.body;
        console.log('📍 Recebida requisição de rota:', { origem, destino, veiculoId });
        if (!origem || !destino || !veiculoId) {
            res.status(400).json({ message: 'Origem, destino e veiculoId são obrigatórios' });
            return;
        }
        const veiculo = await Veiculo_1.default.findOne({
            _id: veiculoId,
            usuarioId: req.usuario._id
        });
        if (!veiculo) {
            res.status(404).json({ message: 'Veículo não encontrado' });
            return;
        }
        let featuresOrigem, featuresDestino;
        try {
            console.log('🛰️  Iniciando geocoding...');
            [featuresOrigem, featuresDestino] = await Promise.all([
                openRouteService_1.OpenRouteService.geocoder(origem),
                openRouteService_1.OpenRouteService.geocoder(destino)
            ]);
            console.log('✅ Geocoding completo');
        }
        catch (error) {
            console.error('❌ Erro no geocoding:', error.message);
            res.status(400).json({
                message: 'Erro ao processar endereços. Verifique se os endereços estão corretos.'
            });
            return;
        }
        if (!featuresOrigem || featuresOrigem.length === 0) {
            res.status(400).json({ message: `Endereço de origem não encontrado: ${origem}` });
            return;
        }
        if (!featuresDestino || featuresDestino.length === 0) {
            res.status(400).json({ message: `Endereço de destino não encontrado: ${destino}` });
            return;
        }
        const coordsOrigem = featuresOrigem[0].geometry.coordinates;
        const coordsDestino = featuresDestino[0].geometry.coordinates;
        console.log('📍 Coordenadas convertidas:', {
            origem: coordsOrigem,
            destino: coordsDestino
        });
        let dadosRota;
        try {
            console.log('🛣️  Calculando rota...');
            dadosRota = await openRouteService_1.OpenRouteService.calcularRota(coordsOrigem, coordsDestino);
            console.log('✅ Rota calculada com sucesso');
        }
        catch (error) {
            console.error('❌ Erro no cálculo da rota:', error.message);
            res.status(400).json({
                message: 'Não foi possível calcular uma rota entre os endereços informados.'
            });
            return;
        }
        console.log('📦 Estrutura COMPLETA da resposta:', JSON.stringify(dadosRota, null, 2).substring(0, 1000));
        let distancia, duracao, geometry;
        if (dadosRota.routes && dadosRota.routes.length > 0) {
            const rotaPrincipal = dadosRota.routes[0];
            distancia = rotaPrincipal.summary.distance / 1000;
            duracao = rotaPrincipal.summary.duration / 60;
            geometry = rotaPrincipal.geometry;
            console.log('📍 Geometry type:', typeof geometry, 'Length:', geometry?.length);
        }
        else {
            throw new Error('Formato de resposta da API não reconhecido');
        }
        let coordenadas = [];
        if (geometry && typeof geometry === 'string') {
            console.log('🔄 Decodificando polyline...');
            try {
                const decoded = polyline_1.default.decode(geometry);
                console.log(`✅ ${decoded.length} pontos decodificados`);
                coordenadas = decoded.map((coord) => ({ latitude: coord[0], longitude: coord[1] }));
            }
            catch (decodeError) {
                console.error('❌ Erro ao decodificar polyline:', decodeError);
            }
        }
        else {
            console.warn('⚠️ Geometry não é uma string (polyline)');
        }
        const origemEndereco = featuresOrigem[0].properties.label;
        const destinoEndereco = featuresDestino[0].properties.label;
        const consumoEstimado = distancia / veiculo.consumoMedio;
        let custoEstimado = undefined;
        if (precoCombustivel) {
            custoEstimado = consumoEstimado * precoCombustivel;
        }
        await HistoricoViagem_1.default.create({
            usuarioId: req.usuario._id,
            veiculoId: req.body.veiculoId,
            origem: req.body.origem,
            destino: req.body.destino,
            consumoEstimado,
            custoEstimado,
            precoCombustivel,
            distancia,
            duracao,
            dadosRota: {
                coordenadas,
                origemEndereco,
                destinoEndereco
            },
            origemEndereco,
            destinoEndereco,
            dataViagem: new Date()
        });
        console.log('📊 Resultado final:', {
            distancia: `${distancia.toFixed(1)} km`,
            duracao: `${Math.round(duracao)} min`,
            consumo: `${consumoEstimado.toFixed(1)} L`,
            coordenadas: `${coordenadas.length} pontos`
        });
        res.json({
            sucesso: true,
            rota: {
                coordenadas,
                origemEndereco,
                destinoEndereco,
                distancia,
                duracao
            },
            consumoEstimado,
            custoEstimado,
            precoCombustivel
        });
    }
    catch (error) {
        console.error('❌ Erro geral ao calcular rota:', error);
        res.status(500).json({
            message: 'Erro interno do servidor. Tente novamente em alguns instantes.'
        });
    }
};
exports.calcularRota = calcularRota;
const listarRotas = async (req, res) => {
    try {
        res.json({ message: 'Lista de rotas - funcionalidade em desenvolvimento' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao listar rotas' });
    }
};
exports.listarRotas = listarRotas;
const obterRota = async (req, res) => {
    try {
        res.json({ message: 'Rota específica - funcionalidade em desenvolvimento' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter rota' });
    }
};
exports.obterRota = obterRota;
const salvarRota = async (req, res) => {
    try {
        const rotaData = { ...req.body, usuarioId: req.usuario._id };
        const rota = await Rota_1.default.create(rotaData);
        const historicoData = {
            usuarioId: req.usuario._id,
            veiculoId: req.body.veiculoId,
            rotaId: rota._id,
            consumoEstimado: req.body.consumoEstimado,
            custoEstimado: req.body.custoEstimado,
            distancia: req.body.distancia,
            duracao: req.body.duracao,
            dadosRota: req.body.coordenadas
        };
        const historico = new HistoricoViagem_1.default(historicoData);
        await historico.save();
        res.json({ message: 'Rota salva - funcionalidade em desenvolvimento' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao salvar rota' });
    }
};
exports.salvarRota = salvarRota;
const atualizarRota = async (req, res) => {
    try {
        res.json({ message: 'Rota atualizada - funcionalidade em desenvolvimento' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar rota' });
    }
};
exports.atualizarRota = atualizarRota;
const excluirRota = async (req, res) => {
    try {
        res.json({ message: 'Rota excluída - funcionalidade em desenvolvimento' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao excluir rota' });
    }
};
exports.excluirRota = excluirRota;
const testarAPI = async (req, res) => {
    try {
        const coordsOrigem = [-46.6333, -23.5505];
        const coordsDestino = [-46.3333, -23.9608];
        const dadosRota = await openRouteService_1.OpenRouteService.calcularRota(coordsOrigem, coordsDestino);
        res.json({
            success: true,
            estrutura: {
                routes: dadosRota.routes ? `Array(${dadosRota.routes.length})` : 'undefined',
                features: dadosRota.features ? `Array(${dadosRota.features.length})` : 'undefined'
            },
            dados: dadosRota
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.testarAPI = testarAPI;
//# sourceMappingURL=rotaController.js.map