import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const criarVeiculo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listarVeiculos: (req: AuthRequest, res: Response) => Promise<void>;
export declare const obterVeiculo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const atualizarVeiculo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const excluirVeiculo: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=veiculoController.d.ts.map