import mongoose, { Document, Schema } from 'mongoose';
import { Alerta as IAlerta } from '../types';

export interface AlertaDocument extends Omit<IAlerta, '_id'>, Document {}

const AlertaSchema: Schema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo: {
    type: String,
    enum: ['consumo', 'custo', 'manutencao'],
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  lida: {
    type: Boolean,
    default: false
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<AlertaDocument>('Alerta', AlertaSchema);