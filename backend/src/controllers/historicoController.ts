import { Request, Response } from 'express';
import HistoricoViagem from '../models/HistoricoViagem';
import { AuthRequest } from '../middleware/auth';

export const criarHistorico = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const historicoData = { ...req.body, usuarioId: req.usuario._id };
    const historico = new HistoricoViagem(historicoData);
    await historico.save();
    res.status(201).json(historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar histórico' });
  }
};

export const listarHistorico = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const historico = await HistoricoViagem.find({ usuarioId: req.usuario._id })
      .populate('veiculoId')
      .populate('rotaId')
      .sort({ dataViagem: -1 });
    
    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar histórico' });
  }
};

export const obterHistorico = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const historico = await HistoricoViagem.findOne({
      _id: req.params.id,
      usuarioId: req.usuario._id
    }).populate('veiculoId').populate('rotaId');
    
    if (!historico) {
      res.status(404).json({ message: 'Histórico não encontrado' });
      return;
    }
    
    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter histórico' });
  }
};

export const excluirHistorico = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const historico = await HistoricoViagem.findOneAndDelete({
      _id: req.params.id,
      usuarioId: req.usuario._id
    });
    
    if (!historico) {
      res.status(404).json({ message: 'Histórico não encontrado' });
      return;
    }
    
    res.json({ message: 'Histórico excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir histórico' });
  }
};

export const gerarRelatorioPeriodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { inicio, fim } = req.query;
    res.json({ message: 'Relatório gerado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
};