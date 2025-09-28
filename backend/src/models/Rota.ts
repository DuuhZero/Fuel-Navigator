import mongoose, { Document, Schema } from 'mongoose';
import { Rota as IRota } from '../types';

export interface RotaDocument extends Omit<IRota, '_id'>, Document {}

const RotaSchema: Schema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  origem: {
    type: Object,
    required: true
  },
  destino: {
    type: Object,
    required: true
  },
  origemEndereco: {
    type: String,
    required: true
  },
  destinoEndereco: {
    type: String,
    required: true
  },
  distancia: {
    type: Number,
    required: true
  },
  duracao: {
    type: Number,
    required: true
  },
  coordenadas: {
    type: Array,
    required: true
  },
  favorita: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<RotaDocument>('Rota', RotaSchema);