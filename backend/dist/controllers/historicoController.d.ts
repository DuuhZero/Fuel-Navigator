import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const criarHistorico: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listarHistorico: (req: AuthRequest, res: Response) => Promise<void>;
export declare const obterHistorico: (req: AuthRequest, res: Response) => Promise<void>;
export declare const excluirHistorico: (req: AuthRequest, res: Response) => Promise<void>;
export declare const gerarRelatorioPeriodo: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=historicoController.d.ts.map