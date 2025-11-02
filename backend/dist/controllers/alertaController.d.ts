import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const listarAlertas: (req: AuthRequest, res: Response) => Promise<void>;
export declare const marcarComoLida: (req: AuthRequest, res: Response) => Promise<void>;
export declare const criarAlerta: (req: AuthRequest, res: Response) => Promise<void>;
export declare const configurarAlertas: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=alertaController.d.ts.map