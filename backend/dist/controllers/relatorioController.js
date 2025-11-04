"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioSemanal = exports.gerarRelatorioMensal = exports.gerarRelatorioPDF = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const HistoricoViagem_1 = __importDefault(require("../models/HistoricoViagem"));
const Veiculo_1 = __importDefault(require("../models/Veiculo"));
const Usuario_1 = __importDefault(require("../models/Usuario"));
const gerarRelatorioPDF = async (req, res) => {
    try {
        const authHeader = req.header('Authorization') || req.headers['authorization'];
        if (!authHeader) {
            res.status(401).json({ message: 'Token de acesso necessário' });
            return;
        }
        const token = String(authHeader).replace('Bearer ', '');
        let userId;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret');
            userId = decoded.userId;
        }
        catch (err) {
            res.status(401).json({ message: 'Token inválido ou expirado' });
            return;
        }
        // Buscar dados do usuário
        const usuario = await Usuario_1.default.findById(userId);
        if (!usuario) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        // Gerar relatório PDF
        const dados = await gerarDadosRelatorioMensal(userId);
        // Configurar cabeçalhos para download do PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="relatorio_${new Date().toISOString().split('T')[0]}.pdf"`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        // Gerar e enviar o PDF
        const doc = new pdfkit_1.default();
        doc.pipe(res);
        // Adicionar conteúdo ao PDF
        doc.fontSize(20).text('Relatório Mensal', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Distância total: ${dados.totalDistance?.toFixed(2) || 0} km`);
        doc.text(`Consumo total: ${dados.totalConsumption?.toFixed(2) || 0} L`);
        doc.text(`Número de rotas: ${dados.numRoutes || 0}`);
        if (dados.mostUsedVehicle) {
            doc.text(`Veículo mais usado: ${dados.mostUsedVehicle.marca || ''} ${dados.mostUsedVehicle.modelo || ''}`);
        }
        doc.end();
    }
    catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ message: 'Erro ao gerar relatório PDF' });
    }
};
exports.gerarRelatorioPDF = gerarRelatorioPDF;
const gerarRelatorioMensal = async (req, res) => {
    try {
        const data = await gerarDadosRelatorioMensal(req.usuario._id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório mensal' });
    }
};
exports.gerarRelatorioMensal = gerarRelatorioMensal;
const gerarRelatorioSemanal = async (req, res) => {
    try {
        res.json({ message: 'Relatório semanal' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao gerar relatório semanal' });
    }
};
exports.gerarRelatorioSemanal = gerarRelatorioSemanal;
async function gerarDadosRelatorioMensal(usuarioId) {
    const date30 = new Date();
    date30.setDate(date30.getDate() - 30);
    const historicos = await HistoricoViagem_1.default.find({ usuarioId, dataViagem: { $gte: date30 } });
    const totalDistance = historicos.reduce((sum, h) => sum + (Number(h.distancia) || 0), 0);
    const totalConsumption = historicos.reduce((sum, h) => sum + (Number(h.consumoEstimado) || 0), 0);
    const numRoutes = historicos.length;
    // calcular veículo mais usado
    const freq = {};
    historicos.forEach((h) => {
        const vid = h.veiculoId ? String(h.veiculoId) : 'unknown';
        freq[vid] = (freq[vid] || 0) + 1;
    });
    let mostUsedVehicle = null;
    let maxCount = 0;
    for (const vid in freq) {
        if (freq[vid] > maxCount && vid !== 'unknown') {
            maxCount = freq[vid];
            mostUsedVehicle = { veiculoId: vid, count: freq[vid] };
        }
    }
    if (mostUsedVehicle) {
        try {
            const veiculo = await Veiculo_1.default.findById(mostUsedVehicle.veiculoId).lean();
            mostUsedVehicle.marca = veiculo?.marca || '';
            mostUsedVehicle.modelo = veiculo?.modelo || '';
        }
        catch (err) {
            // ignore
        }
    }
    return {
        totalDistance,
        totalConsumption,
        numRoutes,
        mostUsedVehicle
    };
}
//# sourceMappingURL=relatorioController.js.map