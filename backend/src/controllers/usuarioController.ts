import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import { AuthRequest } from '../middleware/auth';

export const obterUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuario = await Usuario.findById(req.usuario._id).select('-senha');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuário' });
  }
};

export const atualizarUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome, telefone, dataNascimento, preferencias, alertasConfig } = req.body;
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { 
        nome, 
        telefone, 
        dataNascimento, 
        preferencias, 
        alertasConfig,
        dataAtualizacao: new Date() 
      },
      { new: true }
    ).select('-senha');

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

export const excluirUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Usuario.findByIdAndDelete(req.usuario._id);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
};