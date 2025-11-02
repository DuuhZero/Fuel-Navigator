import mongoose, { Document } from 'mongoose';
import { HistoricoViagem as IHistoricoViagem } from '../types';
export interface HistoricoViagemDocument extends Omit<IHistoricoViagem, '_id'>, Document {
}
declare const _default: mongoose.Model<HistoricoViagemDocument, {}, {}, {}, mongoose.Document<unknown, {}, HistoricoViagemDocument> & HistoricoViagemDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=HistoricoViagem.d.ts.map