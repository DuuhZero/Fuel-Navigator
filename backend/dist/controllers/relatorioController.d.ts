import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const gerarRelatorioPDF: (req: Request, res: Response) => Promise<void>;
export declare const gerarRelatorioMensal: (req: AuthRequest, res: Response) => Promise<void>;
export declare const gerarRelatorioSemanal: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=relatorioController.d.ts.map