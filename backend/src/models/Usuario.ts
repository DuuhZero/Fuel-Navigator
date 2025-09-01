import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Usuario as IUsuario } from '../types';

export interface UsuarioDocument extends Omit<IUsuario, '_id'>, Document {
  compararSenha(senha: string): Promise<boolean>;
}

const UsuarioSchema: Schema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  },
  telefone: {
    type: String,
    trim: true
  },
  dataNascimento: {
    type: Date
  },
  preferencias: {
    tema: {
      type: String,
      enum: ['claro', 'escuro'],
      default: 'claro'
    },
    unidadeConsumo: {
      type: String,
      enum: ['km_l', 'l_100km'],
      default: 'km_l'
    },
    moeda: {
      type: String,
      default: 'BRL'
    }
  },
  alertasConfig: {
    limiteConsumo: Number,
    limiteCusto: Number,
    notificacoesAtivas: {
      type: Boolean,
      default: true
    }
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

UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

UsuarioSchema.methods.compararSenha = async function(senha: string): Promise<boolean> {
  return await bcrypt.compare(senha, this.senha);
};

export default mongoose.model<UsuarioDocument>('Usuario', UsuarioSchema);