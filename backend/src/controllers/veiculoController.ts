import { Request, Response } from 'express';
import Veiculo from '../models/Veiculo';
import { AuthRequest } from '../middleware/auth';

export const criarVeiculo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const veiculoData = { 
      ...req.body, 
      usuarioId: req.usuario._id,
      consumoMedio: parseFloat(req.body.consumoMedio)
    };
    
    const veiculo = new Veiculo(veiculoData);
    await veiculo.save();
    
    res.status(201).json({
      message: 'Veículo criado com sucesso',
      veiculo
    });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    res.status(500).json({ message: 'Erro ao criar veículo' });
  }
};
export const listarVeiculos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const veiculos = await Veiculo.find({ usuarioId: req.usuario._id });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar veículos' });
  }
};

export const obterVeiculo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const veiculo = await Veiculo.findOne({ 
      _id: req.params.id, 
      usuarioId: req.usuario._id 
    });
    
    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
      return;
    }
    
    res.json(veiculo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter veículo' });
  }
};

export const atualizarVeiculo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, dataAtualizacao: new Date() };

    if (updates.consumoMedio) {
      updates.consumoMedio = parseFloat(updates.consumoMedio);
    }

    const veiculo = await Veiculo.findOneAndUpdate(
      { _id: id, usuarioId: req.usuario._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
      return;
    }

    res.json({
      message: 'Veículo atualizado com sucesso',
      veiculo
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ message: 'Erro ao atualizar veículo' });
  }
};

export const excluirVeiculo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const veiculo = await Veiculo.findOneAndDelete({
      _id: req.params.id,
      usuarioId: req.usuario._id
    });
    
    if (!veiculo) {
      res.status(404).json({ message: 'Veículo não encontrado' });
      return;
    }
    
    res.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir veículo' });
  }
};