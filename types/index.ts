export interface ClienteFormData {
  nome: string
  cnpj: string
  inscricao_estadual: string
  endereco: string
  telefone: string
  contato: string
}

export interface ItemRow {
  id: string
  descricao: string
  quantidade: number
  valorUnitario: number
}

export interface ConfigPagamento {
  id: number
  banco: string | null
  agencia: string | null
  conta: string | null
  favorecido: string | null
  cnpj_favorecido: string | null
  chave_pix: string | null
  tipo_chave: string | null
  nome_empresa: string | null
  cnpj_empresa: string | null
  endereco_empresa: string | null
  contato_empresa: string | null
}

export interface Cliente {
  id: string
  nome: string
  cnpj: string | null
  inscricao_estadual: string | null
  endereco: string | null
  telefone: string | null
  contato: string | null
  created_at: string
}

export interface OrcamentoItem {
  id: string
  orcamento_id: string
  servico_id: string | null
  descricao: string
  quantidade: number
  valor_unitario: number
  subtotal: number
}

export interface Orcamento {
  id: string
  numero: number
  cliente_id: string | null
  prazo_entrega: string | null
  forma_pagamento: string | null
  frete: number
  subtotal: number
  total: number
  status: 'rascunho' | 'enviado' | 'aprovado'
  created_at: string
  updated_at: string
  clientes?: Cliente
}

export type OrcamentoStatus = 'rascunho' | 'enviado' | 'aprovado'
