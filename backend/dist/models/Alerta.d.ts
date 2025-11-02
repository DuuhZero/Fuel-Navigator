import mongoose, { Document } from 'mongoose';
import { Alerta as IAlerta } from '../types';
export interface AlertaDocument extends Omit<IAlerta, '_id'>, Document {
}
declare const _default: mongoose.Model<AlertaDocument, {}, {}, {}, mongoose.Document<unknown, {}, AlertaDocument> & AlertaDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Alerta.d.ts.map