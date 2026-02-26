import Link from 'next/link'
import { getDbPool } from '@/lib/db'
import { Imovel } from '@/types'
import { Plus, Edit, MapPin, Tag, Box } from 'lucide-react'

async function getImoveis(): Promise<Imovel[]> {
  const pool = getDbPool()
  const [rows] = await pool.execute(
    `SELECT i.*, 
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
       FROM imovel_fotos WHERE imovel_id = i.id) as fotos_json
    FROM imoveis i 
    ORDER BY i.created_at DESC`
  ) as any[]

  return rows.map((row: any) => ({
    ...row,
    fotos: row.fotos_json ? ((typeof row.fotos_json === 'string' ? JSON.parse(row.fotos_json) : row.fotos_json) || []).filter((f: any) => f && f.id).sort((a: any, b: any) => a.ordem - b.ordem) : [],
  }))
}

export default async function AdminImoveisPage() {
  const imoveis = await getImoveis()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 font-heading text-white">Imóveis</h1>
          <p className="text-neutral-400">Gerencie todo o catálogo de propriedades da PH Silva.</p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm w-fit shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Novo Imóvel
        </Link>
      </div>

      <div className="bg-background-lighter rounded-2xl border border-white/5 shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-neutral-400 text-sm font-medium">
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 min-w-[300px]">Imóvel</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {imoveis.map((imovel) => (
                <tr key={imovel.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-neutral-500 font-mono text-sm">#{imovel.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {imovel.fotos?.[0]?.url ? (
                        <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden shrink-0 border border-white/5">
                          <img src={imovel.fotos[0].url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                          <Box className="w-5 h-5 text-neutral-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-medium group-hover:text-primary-light transition-colors line-clamp-1">{imovel.titulo}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400 capitalize">
                          <Tag className="w-3 h-3" />
                          {imovel.tipo} para {imovel.operacao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {imovel.cidade}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium text-sm">
                    R$ {imovel.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${imovel.status === 'disponivel' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      imovel.status === 'reservado' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                      }`}>
                      {imovel.status === 'disponivel' ? 'Disponível' :
                        imovel.status === 'reservado' ? 'Reservado' : 'Vendido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/admin/imoveis/${imovel.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors border border-white/5"
                      title="Editar Imóvel"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {imoveis.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Nenhum imóvel cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
