import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import usuarioRoutes from './routes/usuario';
import veiculoRoutes from './routes/veiculo';
import rotaRoutes from './routes/rota';
import historicoRoutes from './routes/historico';
import alertaRoutes from './routes/alerta';
import relatorioRoutes from './routes/relatorio';

// Importar modelos para garantir registro no Mongoose antes de qualquer populate
import './models/Usuario';
import './models/Veiculo';
import './models/Rota';
import './models/HistoricoViagem';
import './models/Alerta';

dotenv.config({ path: '.env' });


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:19006',    // Expo Web
    'http://', // Seu IP com Expo Web
    'exp://',  // Seu IP com Expo Device
    /\.exp\.direct$/             // Expo Direct
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelnav';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err: Error) => {
    console.error('Erro ao conectar com MongoDB:', err);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/rotas', rotaRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/relatorios', relatorioRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default app;