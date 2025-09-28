import mongoose, { Document, Schema } from 'mongoose';
import { HistoricoViagem as IHistoricoViagem } from '../types';

export interface HistoricoViagemDocument extends Omit<IHistoricoViagem, '_id'>, Document {}

const HistoricoViagemSchema: Schema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  veiculoId: {
    type: Schema.Types.ObjectId,
    ref: 'Veiculo',
    required: true
  },
  rotaId: {
    type: Schema.Types.ObjectId,
    ref: 'Rota'
  },
  origem: {
    type: String,
    required: false
  },
  destino: {
    type: String,
    required: false
  },
  dataViagem: {
    type: Date,
    default: Date.now
  },
  consumoEstimado: {
    type: Number,
    required: true
  },
  custoEstimado: Number,
  precoCombustivel: Number,
  distancia: {
    type: Number,
    required: true
  },
  duracao: {
    type: Number,
    required: true
  },
  dadosRota: Schema.Types.Mixed
});

export default mongoose.model<HistoricoViagemDocument>('HistoricoViagem', HistoricoViagemSchema);