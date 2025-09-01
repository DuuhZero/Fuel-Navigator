import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';

export interface AuthRequest extends Request {
  usuario?: any;
}

export const autenticar = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Token de acesso necessário' });
      return;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findById(decoded.userId).select('-senha');

    if (!usuario) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};