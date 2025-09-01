import mongoose, { Document, Schema } from 'mongoose';
import { Veiculo as IVeiculo } from '../types';

export interface VeiculoDocument extends Omit<IVeiculo, '_id'>, Document {}

const VeiculoSchema: Schema = new Schema({
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  ano: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  placa: {
    type: String,
    trim: true,
    uppercase: true
  },
  consumoMedio: {
    type: Number,
    required: true,
    min: 0.1
  },
  tipoCombustivel: {
    type: String,
    enum: ['gasolina', 'etanol', 'diesel', 'flex'],
    default: 'gasolina'
  },
  capacidadeTanque: {
    type: Number,
    min: 0
  },
  cor: {
    type: String,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<VeiculoDocument>('Veiculo', VeiculoSchema);