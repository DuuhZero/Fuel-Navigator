import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from '../src/routes/auth';
import usuarioRoutes from '../src/routes/usuario';
import veiculoRoutes from '../src/routes/veiculo';
import rotaRoutes from '../src/routes/rota';
import historicoRoutes from '../src/routes/historico';
import alertaRoutes from '../src/routes/alerta';
import relatorioRoutes from '../src/routes/relatorio';
dotenv.config({ path: '.env' });

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*', 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI não definida no .env');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err: Error) => {
    console.error('Erro ao conectar com MongoDB Atlas:', err);
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

export default app;

export const handler = app;
