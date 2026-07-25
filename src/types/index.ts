export type StatusOS = 
  | 'em_diagnostico' 
  | 'aguardando_peca' 
  | 'aguardando_aprovacao' 
  | 'em_execucao' 
  | 'concluido' 
  | 'cancelado';

export interface Oficina {
  id: string;
  nome: string;
  slug: string;
  whatsapp: string;
  cnpj?: string;
  endereco?: string;
}

export interface Cliente {
  id: string;
  oficina_id?: string;
  nome: string;
  whatsapp: string;
  telefone?: string;
  cpf_cnpj?: string;
  criado_em?: string;
}

export interface Veiculo {
  id: string;
  oficina_id?: string;
  cliente_id?: string;
  placa: string;
  modelo: string;
  marca?: string;
  ano?: string;
  km_atual: number;
  cor?: string;
}

export interface Peca {
  id: string;
  oficina_id?: string;
  nome: string;
  codigo_sku?: string;
  preco_unitario: number;
  quantidade_estoque: number;
}

export interface ItemOS {
  id: string;
  tipo: 'peca' | 'servico';
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export type CategoriaFoto = 'avaria' | 'painel_km' | 'pneu' | 'geral';

export interface VistoriaFoto {
  id: string;
  url: string;
  descricao?: string;
  categoria: CategoriaFoto;
  data_criacao: string;
}

export interface OrdemServico {
  id: string; // Ex: OS-2026-089
  oficina_id?: string;
  cliente: Cliente;
  veiculo: Veiculo;
  status: StatusOS;
  vistorias: VistoriaFoto[];
  itens: ItemOS[];
  defeito_relatado: string;
  diagnostico_tecnico?: string;
  valor_total: number;
  garantia_dias: number; // ex: 90
  data_garantia_limite: string;
  data_abertura: string;
  data_previsao?: string;
  observacoes?: string;
}

export interface DashboardStats {
  osAbertas: number;
  aguardandoAprovacao: number;
  faturamentoMes: number;
  veiculosNoPatio: number;
}
