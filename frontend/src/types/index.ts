export interface Usuario {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: Date;
  preferencias: PreferenciasUsuario;
  alertasConfig: AlertasConfig;
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
  _id: string;
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
}

export interface Coordenada {
  latitude: number;
  longitude: number;
}

export interface Rota {
  _id: string;
  usuarioId: string;
  nome: string;
  origem: Coordenada;
  destino: Coordenada;
  origemEndereco: string;
  destinoEndereco: string;
  distancia: number;
  duracao: number;
  coordenadas: Coordenada[];
  favorita: boolean;
}

export interface HistoricoViagem {
  _id: string;
  usuarioId: string;
  veiculoId: string;
  rotaId: string;
  dataViagem: Date;
  consumoEstimado: number;
  custoEstimado?: number;
  precoCombustivel?: number;
  distancia: number;
  duracao: number;
}

export interface CalculoRota {
  distancia: number;
  duracao: number;
  consumoEstimado: number;
  custoEstimado?: number;
  coordenadas: Coordenada[];
}