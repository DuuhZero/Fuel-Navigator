import mongoose, { Document } from 'mongoose';
import { Rota as IRota } from '../types';
export interface RotaDocument extends Omit<IRota, '_id'>, Document {
}
declare const _default: mongoose.Model<RotaDocument, {}, {}, {}, mongoose.Document<unknown, {}, RotaDocument> & RotaDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Rota.d.ts.map