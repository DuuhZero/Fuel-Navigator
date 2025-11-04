import mongoose, { Document } from 'mongoose';
import { Usuario as IUsuario } from '../types';
export interface UsuarioDocument extends Omit<IUsuario, '_id'>, Document {
    compararSenha(senha: string): Promise<boolean>;
}
declare const _default: mongoose.Model<UsuarioDocument, {}, {}, {}, mongoose.Document<unknown, {}, UsuarioDocument> & UsuarioDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Usuario.d.ts.map