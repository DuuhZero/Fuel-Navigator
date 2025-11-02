import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    usuario?: any;
}
export declare const autenticar: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map