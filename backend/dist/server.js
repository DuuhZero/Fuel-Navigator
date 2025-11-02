"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const veiculo_1 = __importDefault(require("./routes/veiculo"));
const rota_1 = __importDefault(require("./routes/rota"));
const historico_1 = __importDefault(require("./routes/historico"));
const alerta_1 = __importDefault(require("./routes/alerta"));
const relatorio_1 = __importDefault(require("./routes/relatorio"));
dotenv_1.default.config({ path: '.env' });
const app = (0, express_1.default)();
// Habilita trust proxy (necessário quando rodando atrás de Vercel / proxies)
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:19006', // Expo Web
        'http://', // Seu IP com Expo Web
        'exp://', // Seu IP com Expo Device
        /\.exp\.direct$/ // Expo Direct
    ],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelnav';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
});
app.use('/api/auth', auth_1.default);
app.use('/api/usuarios', usuario_1.default);
app.use('/api/veiculos', veiculo_1.default);
app.use('/api/rotas', rota_1.default);
app.use('/api/historico', historico_1.default);
app.use('/api/alertas', alerta_1.default);
app.use('/api/relatorios', relatorio_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Servidor funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`🔗 MongoDB: ${MONGODB_URI}`);
    console.log('OPENROUTE_API_KEY:', process.env.OPENROUTE_API_KEY ? '✓ Carregada' : '✗ Não carregada');
});
exports.default = app;
//# sourceMappingURL=server.js.map