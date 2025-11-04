import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const obterUsuario: (req: AuthRequest, res: Response) => Promise<void>;
export declare const atualizarUsuario: (req: AuthRequest, res: Response) => Promise<void>;
export declare const excluirUsuario: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=usuarioController.d.ts.map