import mongoose, { Document } from 'mongoose';
import { Veiculo as IVeiculo } from '../types';
export interface VeiculoDocument extends Omit<IVeiculo, '_id'>, Document {
}
declare const _default: mongoose.Model<VeiculoDocument, {}, {}, {}, mongoose.Document<unknown, {}, VeiculoDocument> & VeiculoDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Veiculo.d.ts.map