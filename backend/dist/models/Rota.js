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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RotaSchema = new mongoose_1.Schema({
    usuarioId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    veiculoId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Veiculo',
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
    consumoEstimado: {
        type: Number,
    },
    custoEstimado: {
        type: Number,
    },
    precoCombustivel: {
        type: Number,
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
exports.default = mongoose_1.default.model('Rota', RotaSchema);
//# sourceMappingURL=Rota.js.map