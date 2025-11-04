import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const calcularRota: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listarRotas: (req: AuthRequest, res: Response) => Promise<void>;
export declare const obterRota: (req: AuthRequest, res: Response) => Promise<void>;
export declare const salvarRota: (req: AuthRequest, res: Response) => Promise<void>;
export declare const atualizarRota: (req: AuthRequest, res: Response) => Promise<void>;
export declare const excluirRota: (req: AuthRequest, res: Response) => Promise<void>;
export declare const testarAPI: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=rotaController.d.ts.map