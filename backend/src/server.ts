import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Rotas
import authRoutes from './routes/auth';
import usuarioRoutes from './routes/usuario';
import veiculoRoutes from './routes/veiculo';
import rotaRoutes from './routes/rota';
import historicoRoutes from './routes/historico';
import alertaRoutes from './routes/alerta';
import relatorioRoutes from './routes/relatorio';
dotenv.config({ path: '.env' });


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:19006',    // Expo Web
    'http://192.168.15.12:19006', // Seu IP com Expo Web
    'exp://192.168.15.12:19000',  // Seu IP com Expo Device
    /\.exp\.direct$/             // Expo Direct
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por janela
});
app.use(limiter);

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelnav';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err: Error) => {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
  });

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/rotas', rotaRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Manipulador de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 MongoDB: ${MONGODB_URI}`);
  console.log('OPENROUTE_API_KEY:', process.env.OPENROUTE_API_KEY ? '✓ Carregada' : '✗ Não carregada');
});

export default app;