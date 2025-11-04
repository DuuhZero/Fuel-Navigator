import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
    const { nome, email, currentPassword, newPassword, preferencias, alertasConfig } = req.body;

    const updateFields: any = {
      dataAtualizacao: new Date()
    };

    if (nome) updateFields.nome = nome;
    if (email) updateFields.email = email;
    if (preferencias) updateFields.preferencias = preferencias;
    if (alertasConfig) updateFields.alertasConfig = alertasConfig;

    // Tratamento de troca de senha
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ message: 'Senha atual necessária para alterar a senha' });
        return;
      }

      const usuarioAtual = await Usuario.findById(req.usuario._id).select('+senha');
      if (!usuarioAtual) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      const senhaValida = await bcrypt.compare(currentPassword, usuarioAtual.senha);
      if (!senhaValida) {
        res.status(400).json({ message: 'Senha atual incorreta' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.senha = await bcrypt.hash(newPassword, salt);
    }

    // Se email for alterado, verificar se já existe
    if (email) {
      const existente = await Usuario.findOne({ email });
      if (existente && String(existente._id) !== String(req.usuario._id)) {
        res.status(400).json({ message: 'Email já em uso' });
        return;
      }
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      updateFields,
      { new: true }
    ).select('-senha');

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
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