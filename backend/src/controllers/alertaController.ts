import { Request, Response } from 'express';
import Alerta from '../models/Alerta';
import { AuthRequest } from '../middleware/auth';

export const listarAlertas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alertas = await Alerta.find({ usuarioId: req.usuario._id }).sort({ dataCriacao: -1 });
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar alertas' });
  }
};

export const marcarComoLida = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alerta = await Alerta.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.usuario._id },
      { lida: true },
      { new: true }
    );
    
    if (!alerta) {
      res.status(404).json({ message: 'Alerta não encontrado' });
      return;
    }
    
    res.json(alerta);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao marcar alerta como lida' });
  }
};

export const criarAlerta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alertaData = { ...req.body, usuarioId: req.usuario._id };
    const alerta = new Alerta(alertaData);
    await alerta.save();
    res.status(201).json(alerta);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar alerta' });
  }
};

export const configurarAlertas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    res.json({ message: 'Alertas configurados' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao configurar alertas' });
  }
};