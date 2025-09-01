export interface Usuario {
  _id?: string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  dataNascimento?: Date;
  preferencias: PreferenciasUsuario;
  alertasConfig: AlertasConfig;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface PreferenciasUsuario {
  tema: 'claro' | 'escuro';
  unidadeConsumo: 'km_l' | 'l_100km';
  moeda: string;
}

export interface AlertasConfig {
  limiteConsumo?: number;
  limiteCusto?: number;
  notificacoesAtivas: boolean;
}

export interface Veiculo {
  _id?: string;
  usuarioId: string;
  marca: string;
  modelo: string;
  ano: number;
  placa?: string;
  consumoMedio: number;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'flex';
  capacidadeTanque?: number;
  cor?: string;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Coordenada {
  latitude: number;
  longitude: number;
}

export interface Rota {
  _id?: string;
  usuarioId: string;
  nome: string;
  origem: Coordenada;
  destino: Coordenada;
  origemEndereco: string;
  destinoEndereco: string;
  distancia: number; // em metros
  duracao: number; // em segundos
  coordenadas: Coordenada[];
  favorita: boolean;
  dataCriacao: Date;
}

export interface HistoricoViagem {
  _id?: string;
  usuarioId: string;
  veiculoId: string;
  rotaId: string;
  dataViagem: Date;
  consumoEstimado: number;
  custoEstimado?: number;
  precoCombustivel?: number;
  distancia: number;
  duracao: number;
  dadosRota: any;
}

export interface Alerta {
  _id?: string;
  usuarioId: string;
  tipo: 'consumo' | 'custo' | 'manutencao';
  mensagem: string;
  lida: boolean;
  dataCriacao: Date;
}

export interface Relatorio {
  periodo: 'semanal' | 'mensal';
  dataInicio: Date;
  dataFim: Date;
  totalViagens: number;
  totalDistancia: number;
  totalConsumo: number;
  totalCusto?: number;
  consumoMedio: number;
  viagens: HistoricoViagem[];
}