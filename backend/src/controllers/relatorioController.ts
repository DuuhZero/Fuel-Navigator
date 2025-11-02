import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import HistoricoViagem from '../models/HistoricoViagem';
import Veiculo from '../models/Veiculo';
import Usuario from '../models/Usuario';

export const gerarRelatorioPDF = async (req: AuthRequest | Request, res: Response): Promise<void> => {
  try {
    let userId;
    
    // Verificar se o token veio via query param (para downloads diretos)
    if ('token' in req.query) {
      try {
        const decoded: any = jwt.verify(req.query.token as string, process.env.JWT_SECRET || 'seu_jwt_secret');
        userId = decoded.userId;
      } catch (err) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
        return;
      }
    } else if ('usuario' in req && req.usuario) {
      // Token veio via middleware de autenticação
      userId = req.usuario._id;
    } else {
      res.status(401).json({ message: 'Autenticação necessária' });
      return;
    }

    // Buscar dados do usuário
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Gerar relatório PDF
    const dados = await gerarDadosRelatorioMensal(userId);
    
    // Configurar cabeçalhos para download do PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio.pdf"');
    
    // Gerar e enviar o PDF
    const doc = new PDFDocument();
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
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório PDF' });
  }
};

export const gerarRelatorioMensal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await gerarDadosRelatorioMensal(req.usuario._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório mensal' });
  }
};

export const gerarRelatorioSemanal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Relatório semanal' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório semanal' });
  }
};

async function gerarDadosRelatorioMensal(usuarioId: any) {
  const date30 = new Date();
  date30.setDate(date30.getDate() - 30);

  const historicos = await HistoricoViagem.find({ usuarioId, dataViagem: { $gte: date30 } });

  const totalDistance = historicos.reduce((sum, h: any) => sum + (Number(h.distancia) || 0), 0);
  const totalConsumption = historicos.reduce((sum, h: any) => sum + (Number(h.consumoEstimado) || 0), 0);
  const numRoutes = historicos.length;

  // calcular veículo mais usado
  const freq: Record<string, number> = {};
  historicos.forEach((h: any) => {
    const vid = h.veiculoId ? String(h.veiculoId) : 'unknown';
    freq[vid] = (freq[vid] || 0) + 1;
  });

  let mostUsedVehicle: any = null;
  let maxCount = 0;
  for (const vid in freq) {
    if (freq[vid] > maxCount && vid !== 'unknown') {
      maxCount = freq[vid];
      mostUsedVehicle = { veiculoId: vid, count: freq[vid] };
    }
  }

  if (mostUsedVehicle) {
    try {
      const veiculo = await Veiculo.findById(mostUsedVehicle.veiculoId).lean();
      mostUsedVehicle.marca = veiculo?.marca || '';
      mostUsedVehicle.modelo = veiculo?.modelo || '';
    } catch (err) {
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