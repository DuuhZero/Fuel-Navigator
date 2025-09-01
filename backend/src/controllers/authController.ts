import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Usuario, { UsuarioDocument } from '../models/Usuario';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';

export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, telefone, dataNascimento } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      res.status(400).json({ message: 'Usuário já existe' });
      return;
    }

    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      telefone,
      dataNascimento,
      preferencias: {
        tema: 'claro',
        unidadeConsumo: 'km_l',
        moeda: 'BRL'
      },
      alertasConfig: {
        notificacoesAtivas: true
      }
    });

    await novoUsuario.save();

    const token = jwt.sign(
      { userId: novoUsuario._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;


    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }


    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { userId: usuario._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};