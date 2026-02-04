export type TipoImovel = 'casa' | 'apartamento' | 'terreno' | 'comercial'
export type OperacaoImovel = 'venda' | 'aluguel'
export type StatusImovel = 'disponivel' | 'reservado' | 'vendido'

export interface Imovel {
  id: number
  titulo: string
  descricao: string
  tipo: TipoImovel
  operacao: OperacaoImovel
  cidade: string
  bairro: string
  endereco: string
  numero: string
  cep: string
  latitude: number | null
  longitude: number | null
  preco: number
  area_total: number | null
  area_construida: number | null
  quartos: number | null
  banheiros: number | null
  vagas: number | null
  destaque: boolean
  status: StatusImovel
  created_at: Date
  updated_at: Date
  fotos?: ImovelFoto[]
}

export interface ImovelFoto {
  id: number
  imovel_id: number
  url: string
  ordem: number
  created_at: Date
}

export interface Contato {
  id: number
  imovel_id: number | null
  nome: string
  email: string
  telefone: string
  mensagem: string
  created_at: Date
}

export interface Usuario {
  id: number
  email: string
  nome: string
  created_at: Date
}

export interface FiltrosImoveis {
  cidade?: string
  tipo?: TipoImovel
  operacao?: OperacaoImovel
  preco_min?: number
  preco_max?: number
  quartos?: number
  banheiros?: number
  vagas?: number
  busca?: string
  page?: number
  limit?: number
}
