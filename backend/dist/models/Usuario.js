"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UsuarioSchema = new mongoose_1.Schema({
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
UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha'))
        return next();
    this.senha = await bcryptjs_1.default.hash(this.senha, 12);
    next();
});
UsuarioSchema.methods.compararSenha = async function (senha) {
    return await bcryptjs_1.default.compare(senha, this.senha);
};
exports.default = mongoose_1.default.model('Usuario', UsuarioSchema);
//# sourceMappingURL=Usuario.js.map